import React from 'react'

import FormField, { FormFieldProps } from './FormField'

export default function PasswordField(props: FormFieldProps): JSX.Element {
  return (
    <FormField type="password" {...props} />
  )
}
