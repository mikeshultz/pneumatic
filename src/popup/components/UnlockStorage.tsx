import React, { useState, ChangeEvent } from 'react'

import useStorage from '../utils/useStorage'

import Button from './Button'
import PasswordField from './PasswordField'

const PASSPHRASE_NAME = 'passphrase'

interface UnlockStorageParams {
  done: Function
}

export default function UnlockStorage(props: UnlockStorageParams): JSX.Element {
  const { done } = props
  const storage = useStorage()
  const [passphrase, setPassphrase] = useState(null)

  function submit(ev: Event) {
    ev.preventDefault()
    console.log('unlock with phassphrase:', passphrase)
    storage.unlock(passphrase).then(() => {
      done(true)
    })
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    if (ev.target.name === PASSPHRASE_NAME) {
      setPassphrase(ev.target.value)
    } else {
      console.debug(`Unknown target ${ev.target.name}`)
    }
  }

  return (
    <div className="splash-container">
      <PasswordField
        name={PASSPHRASE_NAME}
        label="Unlock passphrase"
        onChange={handleChange} />
      <Button text="Unlock" onClick={submit} />
    </div>
  )
}
