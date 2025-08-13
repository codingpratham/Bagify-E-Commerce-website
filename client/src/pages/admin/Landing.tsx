import { useEffect, useState } from "react";
import { api2 } from "../../utils/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: string;
}

export const AdminLanding = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api2.get("/products/admin");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const statusCounts = {
    PENDING: products.filter((p) => p.status === "PENDING").length,
    SHIPPED: products.filter((p) => p.status === "SHIPPED").length,
    DELIVERED: products.filter((p) => p.status === "DELIVERED").length,
  };

  const totalSales = products
    .filter((p) => p.status === "DELIVERED")
    .reduce((acc, p) => acc + p.price * p.stock, 0);

  const filteredProducts = filteredStatus
    ? products.filter((p) => p.status === filteredStatus)
    : products;

  const chartData = [
    { name: "Pending", count: statusCounts.PENDING },
    { name: "Shipped", count: statusCounts.SHIPPED },
    { name: "Delivered", count: statusCounts.DELIVERED },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalSales.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setFilteredStatus(status)}
            className={`p-4 rounded-xl cursor-pointer shadow hover:bg-blue-50 transition border ${
              filteredStatus === status ? "border-blue-500" : "border-transparent"
            }`}
          >
            <h3 className="text-sm text-gray-500">{status}</h3>
            <p className="text-xl font-bold">{count}</p>
          </div>
        ))}
        {filteredStatus && (
          <button
            onClick={() => setFilteredStatus(null)}
            className="col-span-full bg-red-100 text-red-600 py-2 px-4 rounded-full hover:bg-red-200"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div
                    className="w-10 h-10 bg-cover bg-center rounded-full"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </td>
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">₹{product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : product.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLanding;