import { useEffect, useState } from "react";
import { api2 } from "../../utils/axios";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  status: string;
}

const ProductInfo = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api2.get("/products/admin");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const statusCounts = {
    PENDING: products.filter((p) => p.status === "PENDING").length,
    SHIPPED: products.filter((p) => p.status === "SHIPPED").length,
    DELIVERED: products.filter((p) => p.status === "DELIVERED").length,
  };

  const filteredProducts =
    selectedStatus === null
      ? products
      : products.filter((p) => p.status === selectedStatus);

  const statusClasses = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
  };

  const renderStatusButton = (status: "PENDING" | "SHIPPED" | "DELIVERED") => (
    <button
      onClick={() => setSelectedStatus(status)}
      className={`p-6 rounded-xl shadow text-center font-medium transition duration-200 ${
        statusClasses[status]
      } ${
        selectedStatus === status ? "ring-2 ring-black" : "hover:scale-[1.02]"
      }`}
    >
      <h3 className="text-lg">{status}</h3>
      <p className="text-3xl font-bold">{statusCounts[status]}</p>
    </button>
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Filter Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {renderStatusButton("PENDING")}
        {renderStatusButton("SHIPPED")}
        {renderStatusButton("DELIVERED")}
      </div>

      {/* Reset Filter */}
      {selectedStatus && (
        <div className="text-right">
          <button
            onClick={() => setSelectedStatus(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{product.title}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        product.status === "PENDING"
                          ? "bg-yellow-200 text-yellow-800"
                          : product.status === "SHIPPED"
                          ? "bg-blue-200 text-blue-800"
                          : product.status === "DELIVERED"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductInfo;
