import React, { useState, useEffect } from 'react'

import UnlockStorage from '../components/UnlockStorage'
import OnBoard from '../components/OnBoard'
import AccountSelector from '../components/AccountSelector'
import useStorage from '../utils/useStorage'

export default function Splash(): JSX.Element {
  const [nonce, setNonce] = useState(0)
  const [dbExists, setDBExists] = useState(false)
  const storage = useStorage()

  useEffect(() => {
    if (storage) {
      if (storage.unlocked) {
        setDBExists(true)
      } else {
        storage.storageExists().then((exists: boolean) => {
          setDBExists(exists)
        }).catch((err: Error) => {
          if (!err.toString().includes('Locked')) {
            // TODO: alert user
            console.error(err)
          }
        })
      }
    }
  })

  const showUnlock = dbExists && !storage.unlocked

  return (
    <div id="splash">
      <div className="splash-image">
        <img src="icons/pneumatic-logo-96x96.png" />
      </div>
      {dbExists
        ? showUnlock
          ? <UnlockStorage onUnlock={() => setNonce(nonce+1)} /> 
          : <AccountSelector />
        : <OnBoard setDBExists={setDBExists} />
      }
    </div>
  )
}
