import { useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone || '', address: user.address || '' });
  const [message, setMessage] = useState('');
  async function submit(e) {
    e.preventDefault();
    const updated = await api('/users/profile', { method: 'PUT', body: JSON.stringify(form) });
    setUser(updated);
    localStorage.setItem('techblue_user', JSON.stringify(updated));
    setMessage('Đã cập nhật hồ sơ');
  }
  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Hồ sơ cá nhân</h1>
        {message && <p className="alert">{message}</p>}
        <label>Họ tên<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
        <label>Số điện thoại<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label>Địa chỉ<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <button className="btn">Lưu</button>
      </form>
    </section>
  );
}
