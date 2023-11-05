const functions = require("firebase-functions");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// })

admin.initializeApp()


// users
const {createUser,deleteUser,getUserDetails,
    userExistsByPhoneNumber,checkIfUserIsAdminByPhone,editUser,checkIfUserIsAdminOrUserByPhone} = require('./users')
exports.createUser = createUser
exports.deleteUser = deleteUser
exports.getUserDetails = getUserDetails
exports.userExistsByPhoneNumber = userExistsByPhoneNumber
exports.checkIfUserIsAdminByPhone = checkIfUserIsAdminByPhone
exports.checkIfUserIsAdminOrUserByPhone = checkIfUserIsAdminOrUserByPhone
exports.editUser = editUser