import React, { useState, ChangeEvent } from 'react'
import omit from 'lodash/omit'

import useStorage from '../utils/useStorage'
import Button from './Button'
import PasswordField from './PasswordField'

export interface OnBoardProps {
  setDBExists: Function
}

const PASSPHRASE_NAME = 'passphrase'
const PASSPHRASE_CONFIRM_NAME = 'confirm'

export default function OnBoard(props: OnBoardProps): JSX.Element {
  const { setDBExists } = props
  const storage = useStorage()
  const [error, setError] = useState(null)
  const [passphrase, setPassphrase] = useState('')
  const [passphaseConfirm, setPassphraseConfirm] = useState('')

  function submit(ev: Event) {
    ev.preventDefault()

    if (error) {
      setError('')
    }

    if (!storage) {
      setError('storage is unavailable')
      return
    }

    storage.setPassphrase(passphrase).then(() => {
      setDBExists(true)
    }).catch((err: Error) => {
      setError(err)
    })
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    if (ev.target.name === PASSPHRASE_NAME) {
      setPassphrase(ev.target.value)
    } else if (ev.target.name === PASSPHRASE_CONFIRM_NAME) {
      setPassphraseConfirm(ev.target.value)
    } else {
      console.debug(`Unknown target ${ev.target.name}`)
    }
  }

  return (
    <div className="splash-container">
      <p>Set the passphrase that will encrypt your account database.</p>
      <PasswordField
        name={PASSPHRASE_NAME}
        label="Encryption passphrase"
        onChange={handleChange} />
      <PasswordField
        name={PASSPHRASE_CONFIRM_NAME}
        label="Confirm passphrase"
        onChange={handleChange} />
      {error ? (
        <div className="error">{error}</div>
      ) : null}
      {passphrase != passphaseConfirm && passphaseConfirm !== '' ? (
        <div className="error">Passphrases do not match</div>
      ) : (null)}
      <Button text="Encrypt" onClick={submit} />
    </div>
  )
}
