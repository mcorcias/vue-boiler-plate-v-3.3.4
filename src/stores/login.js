import { defineStore } from "pinia";
import { ref } from "vue";

export const useLogin = defineStore('login', () => {
    const login_admin_screen = ref(false)
    const login_user_panel = ref(false)
    
    return{
        login_admin_screen,
        login_user_panel
    }
})