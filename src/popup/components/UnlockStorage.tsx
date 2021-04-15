import React, { useState, ChangeEvent } from 'react'

import useStorage from '../utils/useStorage'

import Button from './Button'
import PasswordField from './PasswordField'
import Error from './Error'

const PASSPHRASE_NAME = 'passphrase'

interface UnlockStorageParams {
  onUnlock: Function
}

export default function UnlockStorage(props: UnlockStorageParams): JSX.Element {
  const { onUnlock } = props
  const storage = useStorage()
  const [unlockError, setUnlockError] = useState(null)
  const [passphrase, setPassphrase] = useState('')

  function submit(ev: Event) {
    ev.preventDefault()
    storage.unlock(passphrase).then((unlocked) => {
      setUnlockError(null)
      setPassphrase('')
      onUnlock()
    }).catch((err: Error) => {
      setUnlockError(err)
    })
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    if (ev.target.name === PASSPHRASE_NAME) {
      setPassphrase(ev.target.value)
    } else {
      console.debug(`Unknown target ${ev.target.name}`)
    }
  }

  if (unlockError) {
    return (
      <div className="splash-container">
        <Error error={unlockError} />
      </div>
    )
  }

  return (
    <div className="splash-container">
      <PasswordField
        name={PASSPHRASE_NAME}
        label="Unlock passphrase"
        onChange={handleChange}
        value={passphrase} />
      <Button text="Unlock" onClick={submit} />
    </div>
  )
}
