import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shippingAddress: user?.address || '', paymentMethod: 'COD' });
  const [message, setMessage] = useState('');
  async function submit(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api('/orders', { method: 'POST', body: JSON.stringify(form) });
      navigate('/orders');
    } catch (err) {
      setMessage(err.message);
    }
  }
  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Thanh toán</h1>
        {message && <p className="alert error">{message}</p>}
        <label>Địa chỉ giao hàng<textarea value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} /></label>
        <label>Phương thức thanh toán
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="COD">COD</option>
            <option value="BANKING">Banking</option>
            <option value="CREDIT_CARD">Thẻ tín dụng mock</option>
          </select>
        </label>
        <button className="btn" type="submit">Đặt hàng</button>
      </form>
    </section>
  );
}
