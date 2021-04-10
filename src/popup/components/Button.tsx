import React from 'react'
import omit from 'lodash/omit'

export interface ButtonProps {
  text: string
  onClick: Function
}

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <button {...omit(props, ['text'])}>{props.text}</button>
  )
}
