import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'
export default (app) => {
  defineRule('required', (value) => {
    if (value.trim()) return true
    return 'This field is required'
  })

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
