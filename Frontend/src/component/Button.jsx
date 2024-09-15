import React from 'react'

const Button = ({label,className,onClick}) => {
  return (
    <div>
        <button className={className} onClick={onClick}>{label}</button>
    </div>
  )
}

export default Button