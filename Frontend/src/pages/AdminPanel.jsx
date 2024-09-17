import React,{useState} from 'react'
import NavBar from '../component/NavBar'
import CreateProduct from '../component/CreateProduct'
import axios from 'axios'

const AdminPanel = () => {
  return (
    <div>
        <NavBar label={"Admin Panel"}/>
        <CreateProduct/>
        <Imageupload/>
    </div>
  )
}

export default AdminPanel

function Imageupload(){
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productPrice', productPrice);
            formData.append('discountPrice', discountPrice);
            formData.append('image', imageFile); // Make sure 'imageFile' is a valid file object
    
            const response = await axios.post('http://localhost:3000/api/v1/addProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log('Product added successfully:', response.data);
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
    };
  
    return (
      <div>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload</button>
        <p>{responseMessage}</p>
      </div>
    );
  };
  