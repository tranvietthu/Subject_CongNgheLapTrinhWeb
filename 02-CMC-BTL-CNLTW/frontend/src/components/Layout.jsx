import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = [
    ['/', 'Trang chủ'],
    ['/products', 'Sản phẩm'],
    ...(user ? [['/cart', 'Giỏ hàng'], ['/orders', 'Đơn hàng'], ['/profile', 'Hồ sơ']] : []),
    ...(user?.role === 'ADMIN' ? [['/admin', 'Admin']] : [])
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">Tech<span>Blue</span></Link>
        <button className="icon-btn mobile-only" onClick={() => setOpen(!open)} aria-label="menu"><Menu size={20} /></button>
        <nav className={open ? 'nav open' : 'nav'}>
          {nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link className="icon-btn" to="/cart" aria-label="cart"><ShoppingCart size={19} /></Link>
          {user ? (
            <>
              <span className="user-chip"><UserRound size={16} />{user.fullName}</span>
              <button className="icon-btn" onClick={logout} aria-label="logout"><LogOut size={18} /></button>
            </>
          ) : (
            <Link className="btn small" to="/login">Đăng nhập</Link>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <strong>Tech Blue</strong>
        <span>Điện thoại chính hãng, giao nhanh, bảo hành minh bạch.</span>
      </footer>
    </div>
  );
}
