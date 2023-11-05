
import router from '@/router';
import { computed } from 'vue';
import store from '../store';

import {auth,signOut} from '../firebase/config'

const push_to = (name) => {
    router.push({name})
}

const is_auth_initialized = computed(() => {
    return store.state.authInitialized
})

const get_user = computed(() => {
    return store.state.user
})

const log_out = async() => {
    await signOut(auth);
}

const go_back = () => {
    router.go(-1)
}


function validateIsraeliMobileNumber(number) {
    const regex = /^05[0-9]\d{7}$/;
    return regex.test(number);
}






export{
    push_to,
    validateIsraeliMobileNumber,
    is_auth_initialized,
    get_user,
    log_out,
    go_back
}