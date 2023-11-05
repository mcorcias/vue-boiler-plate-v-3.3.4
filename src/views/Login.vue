<template>
    <div class="login">
        <h1>login</h1>
    </div>
</template>

<script setup>
    import {validateIsraeliMobileNumber} from '../scripts/utils'
    import {slide_pop_notification} from '../scripts/msgs'
    import {auth,RecaptchaVerifier,signInWithPhoneNumber} from '../firebase/config'
    import router from '../router'
    import {check_if_user_exist_by_phone_number,check_if_user_is_admin_by_phone_number,check_if_user_is_admin_or_user_by_phone_number} from '../scripts/login'

    import { ref } from 'vue';
    import store from '../store';
    import { storeToRefs } from 'pinia'
    import { onMounted } from 'vue'
    import {useLogin} from '../stores/login'
    const {login_admin_screen,login_user_panel} = storeToRefs(useLogin())

    const step = ref(1)
    const otp = ref('')
    const verificationCode = ref('')
    const loading = ref(false)

    const handle_submit_phone = async () => {
        try {
            loading.value = true;
            if (!validateIsraeliMobileNumber(otp.value)) {
                throw new Error('המספר שהוזן לא תקין!');
            }
            const phoneNumber = "+972" + otp.value.slice(1);
       
            if(!await check_if_user_exist_by_phone_number(phoneNumber)){
                throw new Error('לא קיים משתמש השייך לטלפון שהוזן!');
            }

            if(login_admin_screen.value && !login_user_panel.value && !await check_if_user_is_admin_by_phone_number(phoneNumber)){
                throw new Error('לא קיים הרשאה למשתמש זה!');
            }
            if(login_user_panel.value && login_user_panel.value && !await check_if_user_is_admin_or_user_by_phone_number(phoneNumber)){
                throw new Error('לא קיים הרשאה למשתמש זה!');
            }
            
            onSignInSubmit()
            
        } catch (err) {
            console.error(err);
            loading.value = false;
            slide_pop_notification('error', err.message);
        }
    };

    const set_captcha = () => {
        try{
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log(response);
    
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // onSignInSubmit();
                }
            });
        }catch(err){
            throw new Error(err)
        }
    };

    const onSignInSubmit = () => {
        const full_phone_number = "+972" + otp.value.slice(1);
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, full_phone_number.trim(), appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult
            loading.value = false
            step.value = 2
        }).catch((error) => {
            throw new Error(error)
        });
    }

    const handle_verify_code = () => {
        try{
            verificationCode.value.trim()
            if (!verificationCode.value) {
                throw new Error("נא להזין את הקוד!")
            }
            loading.value = true
            // const code = '123456';
            window.confirmationResult.confirm(verificationCode.value).then(async (result) => {
                loading.value = false
                await window.recaptchaVerifier.clear()
                store.state.authInitialized = false;
                
                if(login_admin_screen.value && !login_user_panel.value){
                    console.log('admin');
                    router.push({name:'admin'})
                }
                else if(login_admin_screen.value && login_user_panel.value){
                    console.log('user');
                    router.push({name:'user_panel'})
                }
    
            }).catch(err => {
                loading.value = false
                verificationCode.value = ''
                console.error(err.message)
                slide_pop_notification('error','הקוד שהוכנס לא נכון!')
            });
        }catch(err){
            console.error(err.message);
            slide_pop_notification('error',err.message)
        }
    }

   onMounted(()=>{
        set_captcha()
   })

</script>

<style lang="scss" scoped>
    .login{
        width: 100%;
        height: 100%;
    }
</style>