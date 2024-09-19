import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [file, setFile] = useState(null);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!productName || !productPrice) {
            return setMsg('Please fill out all required fields.');
        }

        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPrice', productPrice);
        formData.append('discountPrice', discountPrice || 0); // default to 0 if not provided
        formData.append('image', file);

        try {
            // Send the POST request with form data
            const response = await axios.post('http://localhost:3000/api/v1/admin/addProduct', 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            // Handle success
            setMsg('Product added successfully!');
            console.log('Product added successfully:', response.data);
            navigate('/');  // Navigate to the homepage or another page after successful submission
        } catch (error) {
            // Handle error
            console.error('Error adding product:', error);
            setMsg('Failed to add product.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6">Create New Product</h1>

            {/* Product Details Section */}
            <div className="border-b pb-4 mb-8">
                <h2 className="text-lg font-medium mb-4">Product Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleSubmit}>
                        {/* Product Image */}
                        <div className="col-span-2 flex items-center">
                            <label className="mr-4 text-gray-700">Product Image</label>
                            <input 
                                type="file" 
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onChange={(e) => setFile(e.target.files[0])} // Corrected file handling
                            />
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                placeholder="Product Name"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>

                        {/* Product Price */}
                        <div>
                            <label className="block text-gray-700 mb-2">Product Price</label>
                            <input
                                type="text"
                                placeholder="Product Price"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={productPrice}
                                onChange={(e) => setProductPrice(e.target.value)}
                            />
                        </div>

                        {/* Discount Price */}
                        <div>
                            <label className="block text-gray-700 mb-2">Discount Price</label>
                            <input
                                type="text"
                                placeholder="Discount Price"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Add Product
                            </button>
                        </div>

                        {/* Message */}
                        {msg && <p className="text-red-500 mt-4">{msg}</p>}
                    </form>
                </div>
            </div>

            {/* Panel Details Section */}
            <div>
                <h2 className="text-lg font-medium mb-4">Panel Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Background Color */}
                    <div>
                        <label className="block text-gray-700 mb-2">Background Color</label>
                        <input
                            type="text"
                            placeholder="Background Color"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Panel Color */}
                    <div>
                        <label className="block text-gray-700 mb-2">Panel Color</label>
                        <input
                            type="text"
                            placeholder="Panel Color"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Text Color */}
                    <div>
                        <label className="block text-gray-700 mb-2">Text Color</label>
                        <input
                            type="text"
                            placeholder="Text Color"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
