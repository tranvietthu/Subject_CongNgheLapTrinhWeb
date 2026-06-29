import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { currency } from '../../components/ProductCard.jsx';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ brands: [], categories: [] });
  const [form, setForm] = useState({
    name: '', description: '', basePrice: 1000000, categoryId: '', brandId: '', imageUrl: '',
    sku: '', color: 'Tech Blue', storage: '128GB', ram: '8GB', price: 1000000, stockQuantity: 10
  });
  const load = async () => {
    setProducts(await api('/admin/products'));
    const data = await api('/products?limit=1');
    setMeta({ brands: data.brands, categories: data.categories });
  };
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault();
    await api('/admin/products', {
      method: 'POST',
      body: JSON.stringify({
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        imageUrl: form.imageUrl || undefined,
        variant: {
          sku: form.sku,
          color: form.color,
          storage: form.storage,
          ram: form.ram,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity),
          conditionStatus: 'NEW'
        }
      })
    });
    setForm({ ...form, name: '', description: '', sku: '' });
    load();
  }
  async function disable(id) {
    await api(`/admin/products/${id}`, { method: 'DELETE' });
    load();
  }
  return (
    <section className="section admin-layout">
      <form className="form-card compact" onSubmit={submit}>
        <h2>Thêm sản phẩm</h2>
        <input placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Danh mục</option>{meta.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
          <option value="">Thương hiệu</option>{meta.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <input placeholder="Giá" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value, price: e.target.value })} />
        <input placeholder="URL ảnh" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input placeholder="Tồn kho" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
        <button className="btn">Lưu sản phẩm</button>
      </form>
      <div className="admin-table">
        <h1>Quản lý sản phẩm</h1>
        {products.map((p) => (
          <div className="admin-row" key={p.id}>
            <strong>{p.name}</strong><span>{p.brand.name}</span><span>{currency.format(Number(p.basePrice))}</span><span>{p.status}</span>
            <button onClick={() => disable(p.id)}>Ẩn</button>
          </div>
        ))}
      </div>
    </section>
  );
}
