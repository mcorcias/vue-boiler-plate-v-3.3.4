
import Swal from 'sweetalert2'

const slide_pop_notification = (type,text,duration = 2500) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-rtl'  // Applying the custom class
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: type,
        title: text
      })
}

const alert = (icon,title,text)=>{
  return Swal.fire({
      icon,
      title,
      text,
  })
}

const alert_confirm = (title)=>{
  return Swal.fire({
      title,
      icon: 'question',
      iconHtml: '?',
      confirmButtonText: 'כן',
      cancelButtonText: 'לא',
      showCancelButton: true,
      showCloseButton: true,
    })
}



export{slide_pop_notification,alert,alert_confirm}