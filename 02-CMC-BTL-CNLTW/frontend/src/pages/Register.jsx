import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <section className="auth-page">
      <form className="form-card" onSubmit={submit}>
        <h1>Đăng ký</h1>
        {error && <p className="alert error">{error}</p>}
        {['fullName', 'email', 'phone', 'address', 'password'].map((field) => (
          <label key={field}>{field === 'fullName' ? 'Họ tên' : field}
            <input type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </label>
        ))}
        <button className="btn" type="submit">Tạo tài khoản</button>
      </form>
    </section>
  );
}
