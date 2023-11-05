
import { httpsCallable,functions } from '../firebase/config';


const check_if_user_exist_by_phone_number = async(phoneNumber)=>{
    try{
        const res = await httpsCallable(functions,'userExistsByPhoneNumber ')({
        phoneNumber 
        })
        return res.data
    }catch(err){
        throw new Error(err)
    }
}

const check_if_user_is_admin_by_phone_number = async(phoneNumber)=>{
    try{
        const res = await httpsCallable(functions,'checkIfUserIsAdminByPhone')({
        phoneNumber 
        })
        return res.data.isAdmin
    }catch(err){
        throw new Error(err)
    }
}

const check_if_user_is_admin_or_user_by_phone_number = async(phoneNumber)=>{
    try{
        const res = await httpsCallable(functions,'checkIfUserIsAdminOrUserByPhone')({
        phoneNumber 
        })
        return res.data.isAdminOrUser
    }catch(err){
        throw new Error(err)
    }
}

export{
check_if_user_exist_by_phone_number,
check_if_user_is_admin_by_phone_number,
check_if_user_is_admin_or_user_by_phone_number
}