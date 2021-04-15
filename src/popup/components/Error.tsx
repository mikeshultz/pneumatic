import React from 'react'

import FormField, { FormFieldProps } from './FormField'

interface ErrorProps {
  error: Error
}

export default function Error(props: ErrorProps): JSX.Element {
  const { error } = props
  return (
    <article className="message is-danger">
      <div className="message-body">
        {error.toString()}
      </div>
    </article>
  )
}
