import React,{useState} from 'react'
import NavBar from '../component/NavBar'
import CreateProduct from '../component/CreateProduct'

const AdminPanel = () => {
  return (
    <div>
        <NavBar label={"Admin Panel"}/>
        <CreateProduct/>
    </div>
  )
}

export default AdminPanel
