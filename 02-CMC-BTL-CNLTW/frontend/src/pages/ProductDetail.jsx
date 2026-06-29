import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { currency } from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    api(`/products/${id}`).then((p) => {
      setProduct(p);
      setVariantId(p.variants?.[0]?.id || '');
    });
  }, [id]);
  if (!product) return <section className="section">Đang tải...</section>;
  const variant = product.variants.find((v) => v.id === Number(variantId)) || product.variants[0];
  const image = product.images?.[0]?.imageUrl;
  async function addToCart() {
    setMessage('');
    try {
      await api('/cart/items', { method: 'POST', body: JSON.stringify({ productVariantId: variant.id, quantity: 1 }) });
      setMessage('Đã thêm vào giỏ hàng');
    } catch (err) {
      setMessage(err.message);
    }
  }
  return (
    <section className="section detail-layout">
      <div className="detail-image"><img src={image} alt={product.name} /></div>
      <div className="detail-info">
        <span className="brand-label">{product.brand.name}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong className="detail-price">{currency.format(Number(variant.price))}</strong>
        <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
          {product.variants.map((v) => <option key={v.id} value={v.id}>{v.color} - {v.ram}/{v.storage}</option>)}
        </select>
        <p className="stock">Tồn kho: {variant.stockQuantity}</p>
        <button className="btn" onClick={addToCart} disabled={variant.stockQuantity <= 0}>Thêm vào giỏ</button>
        <Link className="btn ghost" to="/cart">Xem giỏ hàng</Link>
        {message && <p className="alert">{message}</p>}
      </div>
    </section>
  );
}
