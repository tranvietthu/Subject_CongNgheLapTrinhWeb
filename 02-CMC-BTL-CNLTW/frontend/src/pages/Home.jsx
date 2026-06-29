import { Link } from 'react-router-dom';
import { BadgePercent, CreditCard, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { demoBrands, demoProducts } from '../data/demoProducts.js';

export default function Home() {
  const [products, setProducts] = useState(demoProducts.slice(0, 8));

  useEffect(() => {
    api('/products?featured=true&limit=8')
      .then((data) => setProducts(data.items?.length ? data.items : demoProducts.slice(0, 8)))
      .catch(() => setProducts(demoProducts.slice(0, 8)));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> Summer phone drop</span>
          <h1>Tech Blue</h1>
          <p>Cua hang dien thoai online phong cach cong nghe: tim nhanh, loc thong minh, gio hang ro rang, thanh toan COD/Banking/Card va dashboard admin de quan ly doanh thu.</p>
          <div className="hero-actions">
            <Link className="btn" to="/products">Mua ngay</Link>
            <Link className="btn ghost" to="/login">Tai khoan demo</Link>
          </div>
          <div className="hero-metrics">
            <div><strong>20+</strong><span>San pham seed</span></div>
            <div><strong>JWT</strong><span>Auth & role</span></div>
            <div><strong>3 phut</strong><span>San sang demo</span></div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="deal-stack">
            <div className="phone-mock">
              <span>5G</span>
              <strong>BlueOS</strong>
              <small>120Hz - 256GB - AI Camera</small>
            </div>
            <div className="deal-card">
              <BadgePercent size={22} />
              <div><strong>Flash sale Tech Blue</strong><span>Giam den 20%, tra gop 0%</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div><ShieldCheck />Bao hanh minh bach</div>
        <div><Truck />Giao hang nhanh</div>
        <div><CreditCard />Thanh toan linh hoat</div>
        <div><Zap />Uu dai moi ngay</div>
      </section>
      <section className="brand-band">
        {demoBrands.map((brand) => <span key={brand.id}>{brand.name}</span>)}
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow blue">Featured phones</span>
            <h2>San pham noi bat</h2>
          </div>
          <Link to="/products">Xem tat ca</Link>
        </div>
        <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
      <section className="section showcase">
        <div>
          <span className="eyebrow blue">Admin ready</span>
          <h2>Dashboard quan ly don hang, user va doanh thu</h2>
          <p>Role ADMIN co khu quan tri rieng: them/sua/an san pham, cap nhat trang thai don, xem best-seller va ton kho.</p>
          <Link className="btn" to="/admin">Vao Admin</Link>
        </div>
        <div className="dashboard-preview">
          <div><span>Revenue</span><strong>128.9M</strong></div>
          <div><span>Orders</span><strong>42</strong></div>
          <div><span>Users</span><strong>186</strong></div>
          <div><span>Stock alerts</span><strong>7</strong></div>
        </div>
      </section>
    </>
  );
}
