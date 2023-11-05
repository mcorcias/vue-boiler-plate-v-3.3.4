// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { he} from 'vuetify/locale'
import { VOtpInput } from 'vuetify/labs/VOtpInput'

export default createVuetify({
  locale: {
    locale: 'he',
    fallback: 'he',
    messages: { he },
    rtl: {he: true},
  },
  components: {
    VOtpInput,
  },
})
