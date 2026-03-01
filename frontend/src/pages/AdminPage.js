import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Package, FolderOpen, FileText, MessageSquare, LogOut, Lightbulb } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [marqueeOrders, setMarqueeOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const navigate = useNavigate();

  const authHeader = {
    auth: {
      username: credentials.username,
      password: credentials.password,
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${API}/admin/quotes`, authHeader);
      setIsAuthenticated(true);
      localStorage.setItem('mono_admin_creds', JSON.stringify(credentials));
      toast.success('Giriş başarılı!');
    } catch (error) {
      toast.error('Geçersiz kullanıcı adı veya şifre');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('mono_admin_creds');
    if (saved) {
      const creds = JSON.parse(saved);
      setCredentials(creds);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await axios.get(`${API}/products?status=`);
        setProducts(res.data);
      } else if (activeTab === 'collections') {
        const res = await axios.get(`${API}/collections`);
        setCollections(res.data);
      } else if (activeTab === 'quotes') {
        const res = await axios.get(`${API}/admin/quotes`, authHeader);
        setQuotes(res.data);
      } else if (activeTab === 'marquee') {
        const res = await axios.get(`${API}/admin/marquee-orders`, authHeader);
        setMarqueeOrders(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      await axios.post(`${API}/admin/seed`, {}, authHeader);
      toast.success('Demo veriler eklendi!');
      fetchData();
    } catch (error) {
      toast.error('Veri ekleme hatası');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, authHeader);
      toast.success('Ürün silindi');
      fetchData();
    } catch (error) {
      toast.error('Silme hatası');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm('Bu koleksiyonu silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`${API}/admin/collections/${id}`, authHeader);
      toast.success('Koleksiyon silindi');
      fetchData();
    } catch (error) {
      toast.error('Silme hatası');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mono_admin_creds');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-mono-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-mono-surface rounded-2xl p-8"
        >
          <h1 className="font-serif text-3xl italic text-mono-cream mb-8 text-center">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                data-testid="admin-username"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                data-testid="admin-password"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              data-testid="admin-login-btn"
              className="w-full py-4 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main data-testid="admin-page" className="min-h-screen bg-mono-cream pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl italic text-mono-primary">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSeedData}
              data-testid="seed-data-btn"
              className="px-4 py-2 font-sans text-xs uppercase tracking-widest border border-mono-accent text-mono-accent rounded-full hover:bg-mono-accent hover:text-mono-black transition-colors"
            >
              Demo Veri Ekle
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-mono-secondary hover:text-mono-cream transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'products', label: 'Ürünler', icon: Package },
            { id: 'collections', label: 'Koleksiyonlar', icon: FolderOpen },
            { id: 'quotes', label: 'Teklif Talepleri', icon: MessageSquare },
            { id: 'marquee', label: 'Işıklı Harf Siparişleri', icon: Lightbulb },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 font-sans text-sm rounded-full transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-mono-accent text-mono-cream'
                  : 'bg-mono-surface text-mono-secondary hover:text-mono-primary'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-mono-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-sans text-lg text-mono-primary">Ürünler ({products.length})</h2>
                  <button
                    onClick={() => setEditingProduct({})}
                    className="flex items-center gap-2 px-4 py-2 font-sans text-xs uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors"
                  >
                    <Plus size={16} />
                    Yeni Ürün
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-mono-border">
                        <th className="text-left py-4 font-sans text-xs uppercase tracking-widest text-mono-secondary">Görsel</th>
                        <th className="text-left py-4 font-sans text-xs uppercase tracking-widest text-mono-secondary">Ürün</th>
                        <th className="text-left py-4 font-sans text-xs uppercase tracking-widest text-mono-secondary">Fiyat</th>
                        <th className="text-left py-4 font-sans text-xs uppercase tracking-widest text-mono-secondary">Durum</th>
                        <th className="text-left py-4 font-sans text-xs uppercase tracking-widest text-mono-secondary">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-mono-border" data-testid={`admin-product-${product.id}`}>
                          <td className="py-4">
                            <div className="w-16 h-16 bg-mono-surface rounded overflow-hidden">
                              {product.images?.[0] && (
                                <img src={product.images[0].src} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="font-sans text-mono-primary">{product.title}</p>
                            <p className="font-sans text-xs text-mono-secondary">{product.handle}</p>
                          </td>
                          <td className="py-4 font-sans text-mono-primary">
                            ₺{product.price?.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 font-sans text-xs rounded ${
                              product.stock_status === 'in_stock' ? 'bg-green-500/20 text-green-400' :
                              product.stock_status === 'made_to_order' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {product.stock_status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-2 text-mono-secondary hover:text-mono-cream transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-mono-secondary hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-sans text-lg text-mono-primary">Koleksiyonlar ({collections.length})</h2>
                  <button
                    onClick={() => setEditingCollection({})}
                    className="flex items-center gap-2 px-4 py-2 font-sans text-xs uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors"
                  >
                    <Plus size={16} />
                    Yeni Koleksiyon
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="bg-mono-surface rounded-lg p-6"
                      data-testid={`admin-collection-${collection.id}`}
                    >
                      <h3 className="font-serif text-xl italic text-mono-primary mb-2">{collection.title}</h3>
                      <p className="font-sans text-sm text-mono-secondary mb-4">{collection.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCollection(collection)}
                          className="p-2 text-mono-secondary hover:text-mono-cream transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="p-2 text-mono-secondary hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div>
                <h2 className="font-sans text-lg text-mono-primary mb-6">Teklif Talepleri ({quotes.length})</h2>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="bg-mono-surface rounded-lg p-6"
                      data-testid={`admin-quote-${quote.id}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-sans text-mono-primary font-medium">{quote.name}</h3>
                          <p className="font-sans text-sm text-mono-secondary">{quote.email}</p>
                        </div>
                        <span className={`px-2 py-1 font-sans text-xs rounded ${
                          quote.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          quote.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                          quote.status === 'quoted' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-mono-secondary mb-2">
                        <span className="text-mono-accent">Kategori:</span> {quote.category}
                      </p>
                      <p className="font-sans text-sm text-mono-secondary">{quote.message}</p>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-center font-sans text-mono-secondary py-8">Henüz teklif talebi yok</p>
                  )}
                </div>
              </div>
            )}

            {/* Marquee Orders Tab */}
            {activeTab === 'marquee' && (
              <div>
                <h2 className="font-sans text-lg text-mono-cream mb-6">Işıklı Harf Siparişleri ({marqueeOrders.length})</h2>
                <div className="space-y-4">
                  {marqueeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-mono-surface rounded-lg p-6"
                      data-testid={`admin-marquee-${order.id}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-serif text-2xl italic text-mono-accent">{order.text}</h3>
                          <p className="font-sans text-sm text-mono-secondary">{order.name} - {order.email}</p>
                        </div>
                        <span className={`px-2 py-1 font-sans text-xs rounded ${
                          order.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans text-sm text-mono-secondary">
                        <p><span className="text-mono-accent">Boyut:</span> {order.size}</p>
                        <p><span className="text-mono-accent">Malzeme:</span> {order.material}</p>
                        <p><span className="text-mono-accent">Işık:</span> {order.light_type}</p>
                        <p><span className="text-mono-accent">Amaç:</span> {order.purpose}</p>
                      </div>
                    </div>
                  ))}
                  {marqueeOrders.length === 0 && (
                    <p className="text-center font-sans text-mono-secondary py-8">Henüz sipariş yok</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          collections={collections}
          authHeader={authHeader}
          onClose={() => setEditingProduct(null)}
          onSave={() => {
            setEditingProduct(null);
            fetchData();
          }}
        />
      )}

      {/* Collection Edit Modal */}
      {editingCollection && (
        <CollectionEditModal
          collection={editingCollection}
          authHeader={authHeader}
          onClose={() => setEditingCollection(null)}
          onSave={() => {
            setEditingCollection(null);
            fetchData();
          }}
        />
      )}
    </main>
  );
};

const ProductEditModal = ({ product, collections, authHeader, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    title_tr: product.title_tr || '',
    handle: product.handle || '',
    description: product.description || '',
    description_tr: product.description_tr || '',
    product_type: product.product_type || 'sculpture',
    price: product.price || 0,
    stock_status: product.stock_status || 'in_stock',
    custom_available: product.custom_available || false,
    materials: product.materials?.join(', ') || '',
    dimensions: product.dimensions || '',
    weight: product.weight || '',
    images: product.images || [],
    collection_ids: product.collection_ids || [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        materials: formData.materials.split(',').map((m) => m.trim()).filter(Boolean),
      };

      if (product.id) {
        await axios.put(`${API}/admin/products/${product.id}`, data, authHeader);
        toast.success('Ürün güncellendi');
      } else {
        await axios.post(`${API}/admin/products`, data, authHeader);
        toast.success('Ürün oluşturuldu');
      }
      onSave();
    } catch (error) {
      toast.error('Kaydetme hatası');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    if (newImageUrl) {
      setFormData({
        ...formData,
        images: [...formData.images, { src: newImageUrl, alt: formData.title, position: formData.images.length }],
      });
      setNewImageUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-mono-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-mono-border">
          <h2 className="font-serif text-2xl italic text-mono-cream">
            {product.id ? 'Ürünü Düzenle' : 'Yeni Ürün'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Başlık (EN)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Başlık (TR)
              </label>
              <input
                type="text"
                value={formData.title_tr}
                onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Handle (URL)
            </label>
            <input
              type="text"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              placeholder="otomatik-olusturulur"
              className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Açıklama (EN)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Fiyat (₺)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Stok Durumu
              </label>
              <select
                value={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              >
                <option value="in_stock" className="bg-mono-surface">Stokta</option>
                <option value="made_to_order" className="bg-mono-surface">Sipariş Üzerine</option>
                <option value="sold_out" className="bg-mono-surface">Tükendi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Malzemeler
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="Seramik, Taş"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Boyutlar
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="120cm x 40cm"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                Ağırlık
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="25kg"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Görsel URL Ekle
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-mono-accent text-mono-black rounded-full font-sans text-xs"
              >
                Ekle
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 bg-mono-black rounded overflow-hidden">
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.custom_available}
                onChange={(e) => setFormData({ ...formData, custom_available: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="font-sans text-mono-cream">Özel Tasarım Mevcut</span>
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-mono-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-sans text-sm uppercase tracking-widest border border-mono-border text-mono-secondary rounded-full hover:text-mono-cream transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CollectionEditModal = ({ collection, authHeader, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: collection.title || '',
    title_tr: collection.title_tr || '',
    handle: collection.handle || '',
    description: collection.description || '',
    description_tr: collection.description_tr || '',
    sort_order: collection.sort_order || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        sort_order: parseInt(formData.sort_order),
      };

      if (collection.id) {
        await axios.put(`${API}/admin/collections/${collection.id}`, data, authHeader);
        toast.success('Koleksiyon güncellendi');
      } else {
        await axios.post(`${API}/admin/collections`, data, authHeader);
        toast.success('Koleksiyon oluşturuldu');
      }
      onSave();
    } catch (error) {
      toast.error('Kaydetme hatası');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-mono-surface rounded-2xl w-full max-w-md">
        <div className="p-6 border-b border-mono-border">
          <h2 className="font-serif text-2xl italic text-mono-cream">
            {collection.id ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Başlık (EN)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Başlık (TR)
            </label>
            <input
              type="text"
              value={formData.title_tr}
              onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
              className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
            />
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors resize-none"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-mono-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 font-sans text-sm uppercase tracking-widest border border-mono-border text-mono-secondary rounded-full hover:text-mono-cream transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
