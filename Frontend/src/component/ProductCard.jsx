import React from 'react'
import {Link} from 'react-router-dom'
const ProductCard = ({
    productName,
    productPrice,
    imageurl
}) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg p-4 bg-pink-50">
    {/* Image Section */}
    <img
      className="w-full h-48 object-cover rounded"
      src={imageurl}
    />

    {/* Product Details */}
    <div className="mt-4 text-center">
      <h3 className="text-lg font-semibold text-gray-800">Clinge Bag</h3>
      <p className="text-gray-500 mt-1">{productPrice}</p>
    </div>

    {/* Add to Cart Button */}
    <div className="flex justify-center mt-4">
      <button className="bg-white border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100" 
      onClick={(e)=>{
        e.preventDefault()

        return(
            <Link to={'/cart'}/>
        )

      }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </button>
    </div>
  </div>

  )
}

export default ProductCard