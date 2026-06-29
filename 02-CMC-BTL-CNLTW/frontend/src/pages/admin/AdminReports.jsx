import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { currency } from '../../components/ProductCard.jsx';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  useEffect(() => { api('/admin/reports/summary').then(setReport); }, []);
  if (!report) return <section className="section">Đang tải thống kê...</section>;
  return (
    <section className="section">
      <h1>Thống kê doanh thu</h1>
      <div className="stats-grid">
        <div><span>Doanh thu</span><strong>{currency.format(report.totalRevenue)}</strong></div>
        <div><span>Tổng đơn</span><strong>{report.totalOrders}</strong></div>
        <div><span>Người dùng</span><strong>{report.totalUsers}</strong></div>
        <div><span>Sắp hết hàng</span><strong>{report.stockProducts.length}</strong></div>
      </div>
      <h2>Sản phẩm bán chạy</h2>
      <div className="table-list">
        {report.bestSellers.map((item, index) => (
          <div className="admin-row" key={index}>
            <strong>{item.variant?.product?.name || 'Chưa có dữ liệu'}</strong>
            <span>Đã bán {item.quantity || 0}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
