import { useEffect, useState } from "react";
import { api2 } from "../../utils/axios";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  totalAmount: number;
  product: Product;
  createdAt: string;
}

const Landing = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api2.get("/products/");
      setProducts(res.data.data || []);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api2.get("/cart/");
      setCart(res.data.data || []);
    } catch {
      toast.error("Failed to fetch cart");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api2.get("/order/get");
      setOrders(res.data.data || []);
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await api2.post("/cart/add", { productId, quantity });
      toast.success("Added to cart");
      fetchCart();
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const getCartQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartTotal = () => cart.reduce((total, item) => total + item.quantity * item.product.price, 0);
  const getOrderTotal = () => orders.reduce((total, order) => total + order.totalAmount, 0);

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user?.name || "Guest"} 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium">Cart Products</h3>
          <p className="text-2xl font-bold">{cart.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium">Cart Quantity</h3>
          <p className="text-2xl font-bold">{getCartQuantity()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium">Cart Total</h3>
          <p className="text-2xl font-bold">₹{getCartTotal()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-medium">Total Orders</h3>
          <p className="text-2xl font-bold">₹{getOrderTotal()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-48 object-cover"
              onClick={() => openProductDetail(product)}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150";
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-medium">{quantities[product.id] || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(product.id, quantities[product.id] || 1)}
                className={`mt-3 w-full flex justify-center items-center gap-2 py-1.5 rounded-lg transition ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <ShoppingCart size={16} />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <Dialog.Title className="text-lg font-bold">{selectedProduct?.title}</Dialog.Title>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedProduct?.image || "https://via.placeholder.com/300"}
                alt={selectedProduct?.title}
                className="w-full h-64 object-cover rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300";
                }}
              />
              <p className="mt-4 text-sm text-gray-600">{selectedProduct?.description}</p>
              <div className="mt-4 text-lg font-semibold text-green-700">₹{selectedProduct?.price}</div>
              <div className="text-sm text-gray-500">Category: {selectedProduct?.category}</div>
              <div className="text-sm text-gray-500">Stock: {selectedProduct?.stock}</div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Landing;