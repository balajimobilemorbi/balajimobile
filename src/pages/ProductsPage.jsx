import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, Search, RefreshCcw, Sparkles 
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { storeCMS } from '../services/storeCMS';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(storeCMS.getProducts());
  const [categories] = useState(storeCMS.getCategories());
  const [brands] = useState(storeCMS.getBrands());

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [selectedRam, setSelectedRam] = useState('all');
  const [selectedStorage, setSelectedStorage] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setProducts(storeCMS.getProducts());
    window.addEventListener('bm_cms_update', handleUpdate);
    return () => window.removeEventListener('bm_cms_update', handleUpdate);
  }, []);

  // Filter logic
  const filteredProducts = (products || []).filter(p => {
    if (!p) return false;
    const title = (p.title || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const ram = (p.ram || '').toLowerCase();
    const storage = (p.storage || '').toLowerCase();
    const price = p.bmPrice || 0;

    if (searchQuery && !title.includes(searchQuery.toLowerCase()) && !brand.includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all') {
      const catObj = categories.find(c => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase());
      const prodCat = (p.category || '').toLowerCase();
      const targetCatName = (catObj?.name || selectedCategory).toLowerCase();
      const targetCatSlug = (catObj?.slug || selectedCategory).toLowerCase();
      if (prodCat !== targetCatName && prodCat !== targetCatSlug && !prodCat.includes(targetCatSlug)) {
        return false;
      }
    }
    if (selectedBrand !== 'all' && brand !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (selectedRam !== 'all' && !ram.includes(selectedRam.toLowerCase())) {
      return false;
    }
    if (selectedStorage !== 'all' && !storage.includes(selectedStorage.toLowerCase())) {
      return false;
    }
    if (price > maxPrice) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const priceA = a?.bmPrice || 0;
    const priceB = b?.bmPrice || 0;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return (b?.rating || 0) - (a?.rating || 0);
    if (sortBy === 'newest') return (b?.isNewArrival ? 1 : 0) - (a?.isNewArrival ? 1 : 0) || (b?.id || '').localeCompare(a?.id || '');
    // Default Featured: New Arrivals prepended at upper top side
    return (b?.isNewArrival ? 1 : 0) - (a?.isNewArrival ? 1 : 0);
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedRam('all');
    setSelectedStorage('all');
    setMaxPrice(200000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
            BALAJI SHOWROOM CATALOG
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#F8F8F8] mt-1">
            Flagship Smartphones ({filteredProducts.length})
          </h1>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex-1 px-4 py-3 rounded-2xl bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] text-xs font-mono font-bold flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4 text-[#D4AF37]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-[#0D1117] border border-white/[0.08] px-4 py-3 rounded-2xl text-xs text-[#F8F8F8]">
            <ArrowUpDown className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#F8F8F8] focus:outline-none cursor-pointer font-mono"
            >
              <option value="featured" className="bg-[#050505] text-[#F8F8F8]">Sort: New Arrivals First</option>
              <option value="newest" className="bg-[#050505] text-[#F8F8F8]">Sort: Latest Unboxed</option>
              <option value="price-low" className="bg-[#050505] text-[#F8F8F8]">Price: Low to High</option>
              <option value="price-high" className="bg-[#050505] text-[#F8F8F8]">Price: High to Low</option>
              <option value="rating" className="bg-[#050505] text-[#F8F8F8]">Top Client Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Collection Tabs (New Arrivals, Trending, All) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        <button
          onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSortBy('featured'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            sortBy === 'featured' && selectedCategory === 'all'
              ? 'bg-[#D4AF37] text-[#050505] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'bg-[#0D1117] text-[#B8BDC8] border border-white/[0.08] hover:text-[#F8F8F8]'
          }`}
        >
          ✨ New Arrivals &amp; All Models
        </button>
        <button
          onClick={() => { setSortBy('newest'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            sortBy === 'newest'
              ? 'bg-[#0FAE72] text-[#050505] shadow-[0_0_15px_rgba(15,174,114,0.4)]'
              : 'bg-[#0D1117] text-[#B8BDC8] border border-white/[0.08] hover:text-[#F8F8F8]'
          }`}
        >
          ⚡ Latest Unboxed Arrivals
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-[#0D1117] p-7 rounded-[28px] border border-white/[0.08] h-fit shadow-[0_20px_50px_rgba(0,0,0,0.8)]`}>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <h3 className="font-display font-bold text-[#F8F8F8] flex items-center gap-2 text-base">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>Catalog Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#B8BDC8] hover:text-[#D4AF37] flex items-center gap-1 font-mono transition"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Search Model</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search iPhone, Ultra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] focus:border-[#D4AF37] outline-none"
              />
              <Search className="w-4 h-4 text-[#B8BDC8] absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Select Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-mono"
            >
              <option value="all" className="bg-[#050505]">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name} className="bg-[#050505]">{b.name}</option>
              ))}
            </select>
          </div>

          {/* RAM Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">RAM Capacity</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {['all', '8GB', '12GB', '16GB', '24GB'].map(ram => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(ram)}
                  className={`py-2 rounded-xl border transition-all duration-300 ${
                    selectedRam === ram
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E7C76A] font-bold'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8]'
                  }`}
                >
                  {ram === 'all' ? 'All RAM' : ram}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Storage Capacity</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {['all', '256GB', '512GB', '1TB'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStorage(st)}
                  className={`py-2 rounded-xl border transition-all duration-300 ${
                    selectedStorage === st
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E7C76A] font-bold'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8]'
                  }`}
                >
                  {st === 'all' ? 'All Storage' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#B8BDC8]">Max Price:</span>
              <span className="text-[#0FAE72] font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="200000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0FAE72] cursor-pointer"
            />
          </div>

        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4">
              <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto" />
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">No Flagships Found</h3>
              <p className="text-xs text-[#B8BDC8] font-mono">Try adjusting your filters or price slider to see more products.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white font-bold text-xs hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] transition inline-block"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
