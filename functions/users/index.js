const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin').firestore;

const db = admin.firestore();

exports.createUser = functions.region('europe-west2').runWith({timeoutSeconds: 540, memory: '8GB'}).https.onCall(async (data, context) => {
    const { phoneNumber, fullName, role,sub_role, image } = data;
    
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'עליך להיות מחובר למערכת!');
    }

    // Check if authenticated user has admin claim
    if (!context.auth.token.admin || context.auth.token.admin !== true) {
        throw new functions.https.HttpsError('permission-denied', 'Permission denied - עליך להיות בעל הרשאת אדמין!');
    }
    if (!phoneNumber || !fullName || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'טלפון, שם מלא, וסוג הרשאה חייבים להיות מסופקים!');
    }
    if(role && (role != 'admin' && role!='user')){
        throw new functions.https.HttpsError('invalid-argument', 'ההרשאה חייבת להיות או admin או user!');
    }

    try {
        // Check if user with phoneNumber already exists
        const existingUsers = await admin.auth().getUsers([{ phoneNumber: phoneNumber }]);
        
        if (existingUsers.users.length > 0) {
            throw new functions.https.HttpsError('already-exists', `המשתמש עם המספר 0${phoneNumber.slice(4)}  כבר קיים!`);
        }

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            phoneNumber: phoneNumber,
            displayName: fullName
        });
        
        if(role == 'admin'){
            // Set the custom user claim (admin in this case)
            await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
        }
        if(role == 'user'){
            // Set the custom user claim (admin in this case)
            await admin.auth().setCustomUserClaims(userRecord.uid, { user: true, role: sub_role });
        }

        // Save user to Firestore
        const userRef = db.collection('Users').doc(userRecord.uid);
        const user_data = {
            uid: userRecord.uid,            // user UID
            phoneNumber,
            fullName,
            role,
            created_at: FieldValue.serverTimestamp(),  // current timestamp
            created_at_string: new Date().toLocaleDateString('he-IL'),
            image
        }
        console.log('user_data:',user_data);
        await userRef.set(user_data);

        return user_data
        
    } catch (error) {
        console.error("Error:", error);
        if (error.code && error.code === 'already-exists') {
            throw new functions.https.HttpsError('already-exists', error);
        }
        throw new functions.https.HttpsError('internal', 'יצירת משתמש חדש נכשלה');
    }
});


exports.editUser = functions.region('europe-west2')
    .runWith({ timeoutSeconds: 540, memory: '8GB' })
    .https.onCall(async (data, context) => {

        // Ensure the user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to update user details.');
        }
        // Check if authenticated user has admin claim
        if (!context.auth.token.admin || context.auth.token.admin !== true) {
            throw new functions.https.HttpsError('permission-denied', 'Permission denied - עליך להיות בעל הרשאת אדמין!');
        }

        // Extract user data from input
        const { fullName, role, image, uid,sub_role} = data;
       
        try{
            // Update Firestore User collection
            const userRef = admin.firestore().collection('Users').doc(uid);
            await userRef.update({
                fullName,
                role,
                image,
            });
    
            // Update Firebase Auth user properties
            await admin.auth().updateUser(uid, {
                displayName: fullName,
                // You can also set other properties like photoURL here if required
            });
    
            // Set custom claim for role
            if (role === 'user') {
                await admin.auth().setCustomUserClaims(uid, { user: true, role: sub_role });
            } 
            else if(role === 'admin'){
                console.log('ssaddsadas');
                await admin.auth().setCustomUserClaims(uid, { admin: true });
            }
            else {
                throw new functions.https.HttpsError('invalid-argument', 'Role must be either admin or user.');
            }
    
            return true;
        }catch(err){
            throw new functions.https.HttpsError('internal', 'יצירת משתמש חדש נכשלה');
        }
});



exports.deleteUser = functions.region('europe-west2').runWith({timeoutSeconds: 540, memory: '8GB'}).https.onCall(async (data, context) => {
    const { userId } = data; // Assuming the user ID is passed in the request data

    // Ensure the user ID is provided
    if (!userId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'User ID must be provided'
        );
    }

    // Ensure the caller is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'עליך להיות מחובר למערכת!'
        );
    }

    // Ensure the caller has admin permissions
    if (!context.auth.token.admin || context.auth.token.admin !== true) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Permission denied - עליך להיות בעל הרשאת אדמין!'
        );
    }

    try {
        // Delete the user from Firebase Authentication
        await admin.auth().deleteUser(userId);

        // Delete the user document from Firestore
        const userRef = db.collection('Users').doc(userId);
        await userRef.delete();

        return true;
    } catch (error) {
        console.error("Error:", error);
        throw new functions.https.HttpsError('internal', 'מחיקת המשתמש נכשלה');
    }
});

exports.getUserDetails = functions.region('europe-west2').https.onCall(async (data, context) => {
    const { userId } = data; // Assuming the user ID is passed in the request data
    // Ensure the user ID is provided
    if (!userId) {
        return null
    }

    try {
        // Fetch the user document from Firestore
        const userRef = db.collection('Users').doc(userId);
        const userSnapshot = await userRef.get();

        // Check if the document exists and return details if it does
        if (userSnapshot.exists) {
            return userSnapshot.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getUserDetails:", error);
    }
});

exports.userExistsByPhoneNumber = functions.region('europe-west2').https.onCall(async (data, context) => {
    const { phoneNumber } = data; // Assuming the phone number is passed in the request data
    console.log(phoneNumber);
    // Ensure the phone number is provided
    if (!phoneNumber) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Phone number must be provided'
        );
    }

    try {
        // Fetch the user by phone number from Firebase Authentication
        const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
        // If fetching the user doesn't throw an error, it means the user exists
        if (userRecord) {
            return true;
        }

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return false;
        }
        console.error("Error userExistsByPhoneNumber:", error);
        throw new functions.https.HttpsError('internal', 'Error checking user by phone number');
    }
});

exports.checkIfUserIsAdminByPhone = functions.region('europe-west2').https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    if (!phoneNumber) {
        throw new functions.https.HttpsError('invalid-argument', 'Phone number must be provided');
    }

    try {
        // Get the user by phone number
        const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);

        // Check if the user has the admin claim
        const isAdmin = userRecord.customClaims && userRecord.customClaims.admin === true;

        // Return the result
        return { isAdmin };

    } catch (error) {
        console.error("Error:", error);
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', `User with phone number ${phoneNumber} not found`);
        }
        throw new functions.https.HttpsError('internal', 'Failed to check user admin status');
    }
});
exports.checkIfUserIsAdminOrUserByPhone = functions.region('europe-west2').https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    if (!phoneNumber) {
        throw new functions.https.HttpsError('invalid-argument', 'Phone number must be provided');
    }

    try {
        // Get the user by phone number
        const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);

        // Check if the user has the admin claim
        const hasAdminClaim = userRecord.customClaims && userRecord.customClaims.admin;
        const hasUserRole = userRecord.customClaims && userRecord.customClaims.user

        const isAdminOrUser = hasAdminClaim || hasUserRole;


        // Return the result
        return { isAdminOrUser };

    } catch (error) {
        console.error("Error:", error);
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', `User with phone number ${phoneNumber} not found`);
        }
        throw new functions.https.HttpsError('internal', 'Failed to check user admin status');
    }
});







