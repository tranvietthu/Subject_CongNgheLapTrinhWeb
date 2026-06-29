import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { currency } from '../../components/ProductCard.jsx';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api('/admin/orders').then(setOrders);
  useEffect(() => { load(); }, []);
  async function update(id, orderStatus) {
    await api(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ orderStatus }) });
    load();
  }
  return (
    <section className="section">
      <h1>Quản lý đơn hàng</h1>
      <div className="table-list">
        {orders.map((o) => (
          <div className="admin-row" key={o.id}>
            <strong>#{o.id} - {o.user.fullName}</strong>
            <span>{currency.format(Number(o.totalAmount))}</span>
            <select value={o.orderStatus} onChange={(e) => update(o.id, e.target.value)}>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Hủy</option>
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
