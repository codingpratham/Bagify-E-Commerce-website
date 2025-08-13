/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW: Import useNavigate
import {  api2 } from "../../utils/axios";
import { Dialog } from "@headlessui/react";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ NEW: Hook for client-side navigation

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api2.get("/products");
      console.log(res.data.data);
      alert("Products loaded successfully");
      toast.success("Products loaded successfully.");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products.");
    }
  };

  const handleQuantityChange = (id: string, change: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[id] || 1) + change);
      return { ...prev, [id]: newQty };
    });
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantities((prev) => ({
      ...prev,
      [product.id]: prev[product.id] || 1,
    }));
    setIsOpen(true);
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const res = await api2.post("/cart/add", { productId, quantity });

      if (res) {
        console.log("Cart updated successfully:", res.data);
        toast.success("Product added to cart successfully!");
        setIsOpen(false);
        navigate("/cart"); // ✅ NEW: Navigate without reload
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while adding to cart";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Explore Products
      </h1>
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
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {product.category}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-green-600">
                  ₹{product.price}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-medium">
                    {quantities[product.id] || 1}
                  </span>
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
                onClick={() =>
                  addToCart(product.id, quantities[product.id] || 1)
                }
                className={`mt-3 w-full flex justify-center items-center gap-2 py-1.5 rounded-lg transition ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <ShoppingCart size={16} />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <Dialog.Title className="text-lg font-bold">
                {selectedProduct?.title}
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedProduct?.image || "https://via.placeholder.com/300"}
                alt={selectedProduct?.title}
                className="w-full h-64 object-cover rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/300";
                }}
              />
              <p className="mt-4 text-sm text-gray-600">
                {selectedProduct?.description}
              </p>
              <div className="mt-4 text-lg font-semibold text-green-700">
                ₹{selectedProduct?.price}
              </div>
              <div className="text-sm text-gray-500">
                Category: {selectedProduct?.category}
              </div>
              <div className="text-sm text-gray-500">
                Stock: {selectedProduct?.stock}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductPage;
