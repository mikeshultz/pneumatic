import React, { useState, useEffect } from 'react'

import UnlockStorage from '../components/UnlockStorage'
import OnBoard from '../components/OnBoard'
import AccountSelector from '../components/AccountSelector'
import useStorage from '../utils/useStorage'

export default function Splash(): JSX.Element {
  const [explicitUnlock, setExplicitUnlock] = useState(false)
  const [dbExists, setDBExists] = useState(false)
  const storage = useStorage()

  //useEffect(() => {}, [dbExists])

  useEffect(() => {
    console.log('useEffect', storage ? storage.unlocked : null)
    if (storage) {
      if (storage.unlocked) {
        setDBExists(true)
      } else {
        console.log('checkinf for fesUnlocked')
        storage.storageExists().then((exists: boolean) => {
          console.log('fesUnlocked: exists', exists)
          setDBExists(!!exists)
        }).catch((err: Error) => {
          if (!err.toString().includes('Locked')) {
            // TODO: alert user
            console.error(err)
          }
        })
        /*storage.get('fesUnlocked').then((exists: string) => {
          console.log('fesUnlocked: exists', exists)
          setDBExists(!!exists)
        }).catch((err: Error) => {
          if (!err.toString().includes('Locked')) {
            // TODO: alert user
            console.error(err)
          }
        })*/
      }
    }
  })
  //}, [storage, unlocked])

  console.log('dbExists:', dbExists)
  console.log('unlocked:', storage ? storage.unlocked : null)

  const showUnlock = dbExists && !storage.unlocked

  return (
    <div id="splash">
      <div className="splash-image">
        <img src="icons/pneumatic-logo-96x96.png" />
      </div>
      {dbExists
        ? showUnlock
          ? <UnlockStorage done={setExplicitUnlock} /> 
          : <AccountSelector />
        : <OnBoard setDBExists={setDBExists} />
      }
    </div>
  )
}
