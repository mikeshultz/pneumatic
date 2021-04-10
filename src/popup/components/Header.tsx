import React from 'react'

export default function Header(): JSX.Element {
  return (
    <div id="header">
      <div className="left">
        <img src="icons/pneumatic-logo-32x32.png" />
      </div>
      <div className="right">
        <h2>Pneumatic</h2>
      </div>
    </div>
  )
}
