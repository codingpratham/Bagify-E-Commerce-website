import React, { useEffect, useState } from "react";
import { api, api2 } from "../../utils/axios";

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

const Product = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null as File | null,
    category: "",
    stock: "",
    status: "PENDING",
  });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api2.get("/products/admin");
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value === null && editId) return;
        if (value !== null) form.append(key, value);
      });

      if (editId) {
        await api.put(`/products/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/products/", form);
      }

      setFormData({
        title: "",
        description: "",
        price: "",
        image: null,
        category: "",
        stock: "",
        status: "PENDING",
      });
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image: null,
      category: product.category,
      stock: product.stock.toString(),
      status: product.status,
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "SHIPPED":
        return "bg-blue-100 text-blue-600";
      case "DELIVERED":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="layout-content-container flex flex-col max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({
              title: "",
              description: "",
              price: "",
              image: null,
              category: "",
              stock: "",
              status: "PENDING",
            });
          }}
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white border rounded-xl overflow-hidden">
          <thead className="bg-gray-50 text-gray-700 font-medium">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div
                    className="w-10 h-10 bg-cover bg-center rounded-full"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </td>
                <td className="p-4 font-medium">{product.title}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(product.status)}`}
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="p-4 text-blue-600 font-semibold">
                  <span
                    onClick={() => handleEdit(product)}
                    className="cursor-pointer hover:underline"
                  >
                    Edit
                  </span>
                  {" | "}
                  <span
                    onClick={() => deleteProduct(product.id)}
                    className="cursor-pointer text-red-600 hover:underline"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">
              {editId ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Product Title"
                required
                className="w-full border p-2 rounded"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full border p-2 rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  {editId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;