
import { httpsCallable,functions } from '../../../firebase/config';

const create_user_in_db = async(phoneNumber,fullName,role,image,sub_role) => {
  try{
    const res = await httpsCallable(functions,'createUser')({
      phoneNumber,
      fullName,
      role,
      sub_role,
      image
    })

    return res.data
  }catch(err){
    throw new Error(err)
  }
}

const edit_user_in_db = async(user) => {
  try{
    const res = await httpsCallable(functions,'editUser')(user)
    return res.data
  }catch(err){
    throw new Error(err)
  }
}

const delete_user_from_db = async(userId) => {
  try{
    const res = await httpsCallable(functions,'deleteUser')({
      userId
    })
    return res.data
  }catch(err){
    throw new Error(err)
  }
}

const get_user_if_exists = async(userId) => {
  try{
    const res = await httpsCallable(functions,'getUserDetails')({
      userId
    })
    return res.data
  }catch(err){
    throw new Error(err)
  }
}

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
    create_user_in_db,
    delete_user_from_db,
    get_user_if_exists,
    check_if_user_exist_by_phone_number,
    check_if_user_is_admin_by_phone_number,
    check_if_user_is_admin_or_user_by_phone_number,
    edit_user_in_db
}