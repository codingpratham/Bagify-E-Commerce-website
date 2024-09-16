import React from 'react'
import { Link } from 'react-router-dom'

const Warning = ({label,navigate}) => {
  return (
    <div class="flex text-center">
        <p>
            {label}
            <div class='text-blue-500 underline '>
            <Link to={`/${navigate}`}> Click here</Link>
            </div>
        </p>
    </div>
  )
}

export default Warning