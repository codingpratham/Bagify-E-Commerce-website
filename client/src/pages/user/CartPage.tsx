/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api2 } from "../../utils/axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
  };
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api2.get("/cart/");
      setCart(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string, showToast = true) => {
    try {
      await api2.delete(`/cart/remove/${itemId}`);
      if (showToast) toast.success("Item removed from cart.");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item.");
    }
  };

  const clearCartUsingRemove = async () => {
    try {
      await api2.delete("/cart/clear");
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Could not clear cart.");
    }
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + item.quantity * item.product.price, 0);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const checkout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const amount = getTotal();
    const cartIds = cart.map((item) => item.id);
    const productIds = cart.map((item) => item.product.id);

    try {
      const { data } = await api2.post("/checkout/create-order", {
        amount,
        cartId: cartIds[0],
        productId: productIds[0],
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Bagify Store",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async (response: any) => {
          try {
            const verify = await api2.post("/checkout/verify-payment", response);
            if (verify.data.success) {
              toast.success("Payment successful!");
              await clearCartUsingRemove();
              navigate("/orders");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error", err);
            toast.error("Something went wrong during verification.");
          }
        },
        prefill: {
          name: user?.name || "Guest User",
          email: user?.email || "guest@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Checkout failed. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image || "https://via.placeholder.com/80"}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) =>
                    ((e.currentTarget as HTMLImageElement).src =
                      "https://via.placeholder.com/80")
                  }
                />
                <div>
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-sm text-gray-500">₹{item.product.price}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-green-600">
                  ₹{item.product.price * item.quantity}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-bold">Total: ₹{getTotal()}</p>
            <button
              className="mt-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
