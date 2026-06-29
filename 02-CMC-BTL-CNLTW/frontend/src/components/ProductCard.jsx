import { Link } from 'react-router-dom';

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function ProductCard({ product }) {
  const variant = product.variants?.[0];
  const image = product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        <span className="floating-badge">{variant?.conditionStatus === 'USED' ? 'May cu' : 'New'}</span>
        <img src={image} alt={product.name} />
      </Link>
      <div className="product-info">
        <div className="card-topline">
          <span className="brand-label">{product.brand?.name}</span>
          {variant?.hasPromotion && <span className="promo">Sale</span>}
        </div>
        <h3>{product.name}</h3>
        <div className="spec-pills">
          <span>{variant?.ram}</span>
          <span>{variant?.storage}</span>
          <span>{variant?.chip || '5G'}</span>
        </div>
        <p>Ton kho: {variant?.stockQuantity || 0} may</p>
        <div className="price-row">
          <strong>{currency.format(Number(variant?.price || product.basePrice))}</strong>
          <span className="pay-note">Tra gop 0%</span>
        </div>
      </div>
    </article>
  );
}

export { currency };
