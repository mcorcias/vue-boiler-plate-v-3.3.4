import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlatformStore = defineStore('platform', () => {
    const platform = ref('pc')

    const setPlatformBasedOnWidth = () => {
        if(window.innerWidth < 600){
            platform.value = 'mobile'
        }else if(window.innerWidth < 900){
            platform.value = 'tablet'
        }
        else{
            platform.value = 'pc'
        }
    }

    const fit_screen = () => {
        // Set platform value initially
        setPlatformBasedOnWidth();

        // Update platform value on every window resize
        window.addEventListener('resize', () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            setPlatformBasedOnWidth();
        });
    }

    return {
          platform,
          fit_screen
    }
});
