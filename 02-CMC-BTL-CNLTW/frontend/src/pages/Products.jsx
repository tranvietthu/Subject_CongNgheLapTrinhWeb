import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { demoBrands, demoProducts } from '../data/demoProducts.js';

export default function Products() {
  const [data, setData] = useState({ items: demoProducts, brands: demoBrands, categories: [], totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', brandId: '', minPrice: '', maxPrice: '', condition: '', promotion: '', page: 1 });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
    api(`/products?${params.toString()}`).then((nextData) => {
      setError('');
      setData(nextData.items?.length ? nextData : {
        ...nextData,
        items: demoProducts,
        brands: nextData.brands?.length ? nextData.brands : demoBrands,
        totalPages: 1
      });
    }).catch((err) => {
      const search = filters.search.trim().toLowerCase();
      const fallbackItems = demoProducts.filter((product) => {
        const price = Number(product.variants[0].price);
        return (!search || product.name.toLowerCase().includes(search))
          && (!filters.brandId || product.brand.id === Number(filters.brandId))
          && (!filters.minPrice || price >= Number(filters.minPrice))
          && (!filters.maxPrice || price <= Number(filters.maxPrice))
          && (filters.promotion !== 'true' || product.variants[0].hasPromotion);
      });
      setData({ items: fallbackItems, brands: demoBrands, categories: [], totalPages: 1 });
      setError(`Dang xem du lieu demo: ${err.message}`);
    });
  }, [filters]);

  return (
    <section className="section catalog">
      <div className="catalog-hero">
        <div>
          <span className="eyebrow blue">Tech Blue catalog</span>
          <h1>Dien thoai</h1>
          <p>Tim theo ten, loc theo thuong hieu, gia, tinh trang va khuyen mai.</p>
        </div>
        <strong>{data.items.length} san pham</strong>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="filters">
        <label className="search-box"><Search size={18} /><input placeholder="Tim theo ten" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} /></label>
        <select value={filters.brandId} onChange={(e) => setFilters({ ...filters, brandId: e.target.value, page: 1 })}>
          <option value="">Tat ca thuong hieu</option>
          {data.brands.map((brand) => <option value={brand.id} key={brand.id}>{brand.name}</option>)}
        </select>
        <input placeholder="Gia tu" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Gia den" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <select value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })}>
          <option value="">Moi/cu</option>
          <option value="NEW">Moi</option>
          <option value="USED">Cu</option>
        </select>
        <select value={filters.promotion} onChange={(e) => setFilters({ ...filters, promotion: e.target.value })}>
          <option value="">Khuyen mai</option>
          <option value="true">Dang sale</option>
        </select>
      </div>
      <div className="product-grid">{data.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      <div className="pager">
        <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Truoc</button>
        <span>{filters.page}/{data.totalPages || 1}</span>
        <button disabled={filters.page >= data.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Sau</button>
      </div>
    </section>
  );
}
