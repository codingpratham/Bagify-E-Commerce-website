import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../component/ProductCard';
import NavBar from '../component/NavBar';
const Product = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/admin/product')
      .then((res) => {
        console.log(res.data);
        
        
        setProducts(res.data || []);
        setLoading(false); 
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
    <>
      <NavBar label={"Products"}/>
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
        <div>No products found.</div> 
      )}
    </div>
      </>
  );
};

export default Product;
