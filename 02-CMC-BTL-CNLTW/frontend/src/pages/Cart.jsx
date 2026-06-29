import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { currency } from '../components/ProductCard.jsx';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const load = () => api('/cart').then(setCart);
  useEffect(() => { load(); }, []);
  async function update(id, quantity) {
    await api(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify({ quantity: Math.max(1, quantity) }) });
    load();
  }
  async function remove(id) {
    await api(`/cart/items/${id}`, { method: 'DELETE' });
    load();
  }
  if (!cart) return <section className="section">Đang tải giỏ hàng...</section>;
  return (
    <section className="section">
      <div className="section-head"><h1>Giỏ hàng</h1><strong>{currency.format(cart.totalAmount || 0)}</strong></div>
      {cart.items.length === 0 ? <p className="empty">Giỏ hàng đang trống.</p> : (
        <>
          <div className="table-list">
            {cart.items.map((item) => (
              <div className="row-item" key={item.id}>
                <img src={item.variant.product.images?.[0]?.imageUrl} alt="" />
                <div><strong>{item.variant.product.name}</strong><p>{currency.format(Number(item.variant.price))}</p></div>
                <input type="number" min="1" value={item.quantity} onChange={(e) => update(item.id, Number(e.target.value))} />
                <button onClick={() => remove(item.id)}>Xóa</button>
              </div>
            ))}
          </div>
          <Link className="btn checkout-btn" to="/checkout">Thanh toán</Link>
        </>
      )}
    </section>
  );
}
