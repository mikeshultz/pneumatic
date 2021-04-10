import React, { useState, useEffect } from 'react'

import useAccounts from '../utils/useAccounts'
import useStorage from '../utils/useStorage'



export default function AccountSelector(): JSX.Element {
  const accounts = useAccounts()
  return (
    <div id="account-selector" className="splash-container">
      asdfasdasdfasdfasdf
      <select>
        <option>0xdeadbeef0000000000000000000</option>
      </select>
    </div>
  )
}
