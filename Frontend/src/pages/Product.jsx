import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../component/ProductCard';

const Product = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/admin/product')
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch((error) => {
        console.error("Error fetching the products:", error);
        setLoading(false);  // Even on error, stop loading
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading state
  }

  return (
    <div>
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product._id}
            imageurl={product.imageUrl}
            productName={product.productName}
            productPrice={product.productPrice}
          />
        ))
      ) : (
        <div>No products found.</div>  // Show message if no products
      )}
    </div>
  );
};

export default Product;
