import React, { ChangeEventHandler } from 'react'

export interface FormFieldProps {
  name: string
  type?: string
  className?: string
  label?: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

export default function FormField(props: FormFieldProps): JSX.Element {
  props = {
    ...props,
    className: props.className ? `${props.className} input` : 'input'
  }

  return (
    <div className="form-field-group">
      {props.label ? 
        <label className="label" htmlFor={props.name}>{props.label}</label>
        : null
      }
      <input {...props} />
    </div>
  )
}
