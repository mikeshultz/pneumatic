import { useState, useEffect } from 'react'
import useStorage from './useStorage'

import { Account } from './accounts'

export default function useAccounts() {
  let accounts: Account[] = []
  const storage = useStorage()

  useEffect(() => {
    if (storage) {
      storage.isUnlocked().then((unlocked: boolean) => {
        if (unlocked) {
          storage.get('accounts').then((accts: Account[]) => {
            accounts = accts
          })
        }
      })
    }
  }, [storage])

  return accounts
}
