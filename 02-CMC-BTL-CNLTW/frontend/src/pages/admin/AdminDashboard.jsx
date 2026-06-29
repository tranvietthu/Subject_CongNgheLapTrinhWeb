import { Link } from 'react-router-dom';
import { Boxes, ChartNoAxesCombined, PackagePlus, UsersRound } from 'lucide-react';

export default function AdminDashboard() {
  const cards = [
    ['/admin/products', 'Sản phẩm', PackagePlus],
    ['/admin/orders', 'Đơn hàng', Boxes],
    ['/admin/users', 'Người dùng', UsersRound],
    ['/admin/reports', 'Thống kê', ChartNoAxesCombined]
  ];
  return (
    <section className="section">
      <h1>Admin Dashboard</h1>
      <div className="admin-grid">
        {cards.map(([to, label, Icon]) => (
          <Link className="admin-tile" to={to} key={to}><Icon /><span>{label}</span></Link>
        ))}
      </div>
    </section>
  );
}
