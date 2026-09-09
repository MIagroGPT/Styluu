import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Tag, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  X,
  Save,
  Eye,
  FolderOpen,
  Camera,
  Upload
} from 'lucide-react';

export const ProductsInventoryManager = () => {
  const { products, setProducts, showToast, formatMoney, currentCurrency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // Editing state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('Afeitado');
  const [editPrice, setEditPrice] = useState(0);
  const [editCostPrice, setEditCostPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editSku, setEditSku] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // New product form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Styluu Lab');
  const [category, setCategory] = useState('Afeitado');
  const [price, setPrice] = useState(22);
  const [costPrice, setCostPrice] = useState(10);
  const [stock, setStock] = useState(25);
  const [sku, setSku] = useState('STY-PROD-01');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80');
  const [description, setDescription] = useState('');

  const categories = ['All', 'Afeitado', 'Fijación & Geles', 'Talcos & Barber', 'Shampoo & Cuidado', 'Tratamientos'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditBrand(prod.brand || 'Styluu Lab');
    setEditCategory(prod.category || 'Afeitado');
    setEditPrice(prod.price);
    setEditCostPrice(prod.costPrice || 0);
    setEditStock(prod.stock);
    setEditSku(prod.sku || '');
    setEditImage(prod.image || '');
    setEditDescription(prod.description || '');
  };

  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: editName,
          brand: editBrand,
          category: editCategory,
          price: Number(editPrice),
          costPrice: Number(editCostPrice),
          stock: Number(editStock),
          sku: editSku,
          image: editImage,
          description: editDescription
        };
      }
      return p;
    });

    setProducts(updated);
    setEditingProduct(null);
    showToast(`Producto "${editName}" actualizado con éxito`, 'success');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      brand,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      image: image || 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
      description
    };

    setProducts([newProduct, ...products]);
    setIsAdding(false);
    setName('');
    setDescription('');
    showToast(`Producto "${name}" agregado al inventario`, 'success');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Producto eliminado del inventario', 'warning');
  };

  const handleUpdateStock = (id, delta) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-brand-carbon">
            Productos & Inventario de Reventa
          </h2>
          <p className="text-xs text-slate-500">
            Gestiona geles, after shaves, talcos, shampoos y cosméticos para venta física y en línea.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm hover:shadow-purple-glow transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Valor Total en Stock</span>
            <DollarSign className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="font-display font-black text-2xl text-brand-carbon">
            {formatMoney(totalInventoryValue)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {totalStockUnits} unidades en total
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Productos Activos</span>
            <Package className="w-4 h-4 text-brand-mint" />
          </div>
          <div className="font-display font-black text-2xl text-brand-carbon">
            {products.length} productos
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Listos para cobro en POS y tienda web
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Stock Bajo / Por Agotar</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display font-black text-2xl text-amber-600">
            {lowStockCount} alertas
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Productos con 5 o menos unidades
          </div>
        </div>
      </div>

      {/* Add New Product Form Drawer */}
      {isAdding && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-purple/40 shadow-lg space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-brand-carbon flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-purple" />
              Añadir Producto al Inventario
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
            <div className="sm:col-span-2">
              <label className="block text-slate-500 mb-1">Nombre del Producto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: After Shave Loción Refrescante Mentol & Eucalipto"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Marca</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Styluu Lab / Reuzel / Proraso"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-purple"
              >
                <option value="Afeitado">Afeitado & After Shave</option>
                <option value="Fijación & Geles">Fijación, Pomadas & Geles</option>
                <option value="Talcos & Barber">Talcos & Cuidado Barbero</option>
                <option value="Shampoo & Cuidado">Shampoo, Acondicionador & Barba</option>
                <option value="Tratamientos">Tratamientos Capilares & Faciales</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Precio de Venta al Público ($ USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Costo de Compra ($ USD)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Stock Inicial (Unidades)</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Código SKU / Barra</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 mb-1">Foto del Producto (URL o ruta local como /mifoto.jpg)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-500 mb-1">Descripción y Beneficios</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cierra los poros, hidrata la piel y deja una fragancia fresca de barbería tradicional..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm"
            >
              Guardar en Inventario
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-purple text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto, marca o SKU..."
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-brand-purple w-full sm:w-64"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const isLowStock = prod.stock <= 5;
          const profit = prod.price - (prod.costPrice || 0);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-brand-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Product Image with Edit Button overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-carbon/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {prod.category}
                    </span>
                  </div>

                  {isLowStock && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Stock Bajo
                    </div>
                  )}

                  {/* Hover Quick Edit Button on Image */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(prod)}
                    className="absolute inset-0 bg-brand-carbon/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs"
                  >
                    <Edit3 className="w-4 h-4 text-brand-mint" />
                    <span>Editar Foto & Precio</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                    <span>{prod.brand}</span>
                    <span className="font-mono text-slate-500">{prod.sku}</span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-carbon leading-snug line-clamp-2">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Stock and Price footer */}
              <div className="p-4 pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Precio Venta</span>
                    <span className="font-display font-black text-xl text-brand-purple">
                      {formatMoney(prod.price)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Margen</span>
                    <span className="font-bold text-xs text-emerald-600">
                      +{formatMoney(profit, false)} ({Math.round((profit / prod.price) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Edit + Stock Controls */}
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(prod)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-brand-purple/10 border border-slate-200 hover:border-brand-purple text-brand-purple font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      onClick={() => handleUpdateStock(prod.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                      title="Restar 1 unidad"
                    >
                      -
                    </button>
                    <span className="font-bold text-[11px] px-1 text-slate-800">{prod.stock}</span>
                    <button
                      onClick={() => handleUpdateStock(prod.id, 1)}
                      className="w-6 h-6 rounded-lg bg-brand-purple text-white font-bold flex items-center justify-center hover:bg-brand-purple-dark"
                      title="Sumar 1 unidad"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 ml-0.5"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT PRODUCT MODAL (POPUP) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200 space-y-6">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-brand-carbon">
                    Editar Producto & Foto
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    ID: {editingProduct.id} • {editingProduct.sku}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditProduct} className="p-6 pt-0 space-y-5 text-xs font-semibold text-slate-700">
              
              {/* Product Photo URL & Live Preview with Drag and Drop / File Picker */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setEditImage(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                className="space-y-3 bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-purple transition-all"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-brand-purple" />
                    Foto del Producto
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Cargar desde mi PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setEditImage(ev.target.result);
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Live Preview & Drag Box */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 bg-white flex-shrink-0 shadow-xs">
                    <img
                      src={editImage || 'https://via.placeholder.com/150'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80'; }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <span className="font-bold text-slate-700 block">Arrastra una foto aquí con el mouse o pulsa "Cargar desde mi PC"</span>
                    <span>También puedes ingresar la URL o ruta abajo:</span>
                    <input
                      type="text"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="https://... o /mifoto.jpg"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>
              </div>

              {/* Price and Cost Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-1">
                  <label className="block text-brand-purple font-bold text-xs uppercase tracking-wider">
                    Precio de Venta ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-purple/40 bg-white text-lg font-black text-brand-carbon focus:outline-none focus:border-brand-purple"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block">Precio que paga el cliente</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <label className="block text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Costo de Compra ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editCostPrice}
                    onChange={(e) => setEditCostPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-lg font-bold text-slate-700 focus:outline-none focus:border-brand-purple"
                  />
                  <span className="text-[10px] text-slate-400 block">Tu costo de adquisición</span>
                </div>
              </div>

              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Marca</label>
                  <input
                    type="text"
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Category, Stock, SKU */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Categoría</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Afeitado">Afeitado & After Shave</option>
                    <option value="Fijación & Geles">Fijación, Pomadas & Geles</option>
                    <option value="Talcos & Barber">Talcos & Cuidado Barbero</option>
                    <option value="Shampoo & Cuidado">Shampoo, Acondicionador & Barba</option>
                    <option value="Tratamientos">Tratamientos Capilares & Faciales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Stock (Unidades)</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">SKU / Código</label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-500 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black shadow-brand-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
