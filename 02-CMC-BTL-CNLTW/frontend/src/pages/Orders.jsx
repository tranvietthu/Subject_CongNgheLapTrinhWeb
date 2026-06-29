import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { currency } from '../components/ProductCard.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api('/orders/my').then(setOrders); }, []);
  return (
    <section className="section">
      <h1>Lịch sử đơn hàng</h1>
      <div className="table-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div><strong>Đơn #{order.id}</strong><span>{order.orderStatus}</span></div>
            <p>{order.items.map((i) => i.variant.product.name).join(', ')}</p>
            <strong>{currency.format(Number(order.totalAmount))}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
