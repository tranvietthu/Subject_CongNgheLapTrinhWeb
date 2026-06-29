import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = () => api('/admin/users').then(setUsers);
  useEffect(() => { load(); }, []);
  async function role(id, value) {
    await api(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role: value }) });
    load();
  }
  return (
    <section className="section">
      <h1>Quản lý người dùng</h1>
      <div className="table-list">
        {users.map((u) => (
          <div className="admin-row" key={u.id}>
            <strong>{u.fullName}</strong><span>{u.email}</span>
            <select value={u.role} onChange={(e) => role(u.id, e.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
