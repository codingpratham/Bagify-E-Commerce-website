import React, { useEffect ,useState} from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar';
import { auth } from '../store/atom';
import axios from 'axios'
import ProductCard from '../component/ProductCard';


const Dashboard = () => {
  const [authStatus, setAuthStatus] = useRecoilState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin');
    } else if (!authStatus) {
      setAuthStatus(true);
    }
  }, [authStatus, setAuthStatus, navigate]);

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
    <div>
      <NavBar label={"Shop."} />
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
    </div>
  );
};

export default Dashboard;
