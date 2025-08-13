import { useEffect, useState } from "react";
import { api2 } from "../../utils/axios";

interface Order {
  id: string;
  totalAmount: number;
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
  createdAt: string;
}

export const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api2.get("/order/get");
      setOrders(res.data.data || []);
      console.log("Orders fetched:", res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-white shadow rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.product.image}
                    alt={order.product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold">{order.product.title}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{order.product.price}
                    </p>
                    <p className="text-sm text-gray-400">
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">
                  ₹{order.totalAmount}
                </span>
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <p className="text-xl font-bold">Total Amount: ₹{getTotalAmount()}</p>
          </div>
        </>
      )}
    </div>
  );
};
