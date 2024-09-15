import React from 'react'

const InputBox = ({
    type,
    placeholder,
    className,
    onChange,
    value
}) => {
  return (
    <div>
        <input type={type} placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange} />
    </div>
  )
}

export default InputBox