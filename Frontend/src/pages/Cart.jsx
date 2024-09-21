import React,{useContext} from 'react';
import { useCart } from '../store/CartContext'; // Adjust the path as needed

const Cart = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="p-4 bg-white rounded shadow-lg max-w-md">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg">{item.productName}</h3>
              <p>${item.productPrice}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
