import React from 'react';

const CreateProduct = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Create New Product</h1>

      {/* Product Details Section */}
      <div className="border-b pb-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="col-span-2 flex items-center">
            <label className="mr-4 text-gray-700">Product Image</label>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Select File
            </button>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-gray-700 mb-2">Product Price</label>
            <input
              type="text"
              placeholder="Product Price"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Discount Price */}
          <div>
            <label className="block text-gray-700 mb-2">Discount Price</label>
            <input
              type="text"
              placeholder="Discount Price"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
