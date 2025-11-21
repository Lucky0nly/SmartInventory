import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  DollarSign,
  FileText,
  Menu,
  X
} from 'lucide-react';

// --- CONFIGURATION & THEME ---
const THEME = {
  colors: {
    primary: '#7e2fed', // Electric Purple
    secondary: '#A8D5E3',
    accent: '#FDE68A',
    background: '#FDFDFD',
    surface: '#FFFFFF',
    textPrimary: '#374151',
    textSecondary: '#6B7280',
    danger: '#EF4444',
    success: '#10B981',
    border: '#E5E7EB'
  }
};

// --- C++ BACKEND CONNECTION SIMULATION ---
/*
 * This section simulates the API calls that would connect to the 
 * C++ InventoryController class we created.
 */
const BackendAPI = {
  // Simulates: InventoryController::getInventory()
  fetchInventory: async () => {
    console.log("Connecting to C++ Backend: Calling getInventory()...");
    // Added delay to simulate real C++ server latency
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
      { id: 1, name: 'Pastel Notebook', price: 12.50, stock: 45, category: 'Stationery' },
      { id: 2, name: 'Gel Pen Set', price: 8.00, stock: 12, category: 'Stationery' },
      { id: 3, name: 'Desk Lamp', price: 35.00, stock: 8, category: 'Electronics' },
      { id: 4, name: 'Ceramic Mug', price: 15.00, stock: 24, category: 'Home' },
      { id: 5, name: 'Planner 2025', price: 22.00, stock: 5, category: 'Stationery' },
    ];
  },

  // Simulates: InventoryController::setStockUpdate(id, qty)
  updateStock: async (id, qty) => {
    console.log(`Connecting to C++ Backend: Calling setStockUpdate(${id}, ${qty})...`);
    return { success: true, message: "Stock Updated in C++ Memory" };
  }
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', onClick, className = '', icon: Icon }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95";
  
  // We use inline styles for specific theme colors to ensure they match exactly
  const styleMap = {
    primary: { backgroundColor: THEME.colors.primary, color: 'white' },
    secondary: { backgroundColor: THEME.colors.secondary, color: THEME.colors.textPrimary },
    danger: { backgroundColor: THEME.colors.danger, color: 'white' },
    outline: { border: `2px solid ${THEME.colors.secondary}`, color: THEME.colors.textPrimary },
    ghost: { color: THEME.colors.textSecondary }
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${className} ${variant === 'ghost' ? 'hover:bg-gray-100' : ''}`}
      style={variant !== 'ghost' ? styleMap[variant] : {}}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', title, highlight }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 ${className}`}>
    {title && (
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center justify-between">
        {title}
        {highlight && <span className="text-xs px-2 py-1 rounded-full bg-[#FDE68A] text-gray-700">{highlight}</span>}
      </h3>
    )}
    {children}
  </div>
);

const Badge = ({ type, children }) => {
  const colors = {
    success: { bg: '#D1FAE5', text: '#065F46' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    danger: { bg: '#FEE2E2', text: '#991B1B' },
    info: { bg: '#DBEAFE', text: '#1E40AF' }
  };
  const style = colors[type] || colors.info;
  return (
    <span 
      className="px-2 py-1 rounded-md text-xs font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {children}
    </span>
  );
};

// LOGIN SCREEN
const LoginScreen = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#A8D5E3] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#7e2fed] opacity-20 blur-3xl"></div>

      <Card className="w-full max-w-md z-10 backdrop-blur-sm bg-white/90">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-[#7e2fed] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Smart Inventory System</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Select Role to Demo:</p>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => onLogin('admin')} className="p-4 rounded-xl border border-gray-200 hover:border-[#7e2fed] hover:bg-purple-50 transition-all flex items-center gap-3 group">
              <div className="p-2 bg-purple-100 rounded-lg text-[#7e2fed] group-hover:bg-[#7e2fed] group-hover:text-white transition-colors"><Settings size={20} /></div>
              <div className="text-left">
                <h3 className="font-bold text-gray-700">Admin</h3>
                <p className="text-xs text-gray-500">Full Access</p>
              </div>
            </button>
            <button onClick={() => onLogin('manager')} className="p-4 rounded-xl border border-gray-200 hover:border-[#A8D5E3] hover:bg-blue-50 transition-all flex items-center gap-3 group">
              <div className="p-2 bg-blue-100 rounded-lg text-[#4AA3C0] group-hover:bg-[#4AA3C0] group-hover:text-white transition-colors"><TrendingUp size={20} /></div>
              <div className="text-left">
                <h3 className="font-bold text-gray-700">Manager</h3>
                <p className="text-xs text-gray-500">Inventory & Reports</p>
              </div>
            </button>
            <button onClick={() => onLogin('cashier')} className="p-4 rounded-xl border border-gray-200 hover:border-[#FDE68A] hover:bg-yellow-50 transition-all flex items-center gap-3 group">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-colors"><ShoppingCart size={20} /></div>
              <div className="text-left">
                <h3 className="font-bold text-gray-700">Cashier</h3>
                <p className="text-xs text-gray-500">Billing Only</p>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// DASHBOARD
const Dashboard = ({ inventory, salesHistory }) => {
  const totalRevenue = salesHistory.reduce((acc, curr) => acc + curr.total, 0);
  const lowStockItems = inventory.filter(i => i.stock < 10);
  
  const Chart = () => (
    <div className="flex items-end gap-2 h-32 mt-4">
      {[40, 70, 45, 90, 60, 85, 50].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
           <div 
             className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80 relative"
             style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? THEME.colors.primary : THEME.colors.secondary }}
           >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ${h * 10}
              </div>
           </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><DollarSign size={100} /></div>
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">${totalRevenue.toFixed(2)}</h2>
          <Badge type="success" className="mt-2 inline-block">+12.5% from last week</Badge>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Package size={100} /></div>
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{inventory.length}</h2>
          <span className="text-xs text-gray-400">Active Inventory</span>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><AlertCircle size={100} /></div>
          <p className="text-gray-500 text-sm">Low Stock Alerts</p>
          <h2 className="text-3xl font-bold text-[#EF4444] mt-2">{lowStockItems.length}</h2>
          <span className="text-xs text-gray-400">Items need restocking</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Sales Overview">
          <Chart />
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Card>

        <Card title="Low Stock Items" highlight="Action Needed">
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500 italic text-sm">All stocked up! 🎉</p>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-red-600 font-bold text-sm">{item.stock} left</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// INVENTORY MANAGER
const InventoryManager = ({ inventory, setInventory, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', stock: '', category: '' });
  const [isEditing, setIsEditing] = useState(false);

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would call BackendAPI.updateStock or addProduct
    if (isEditing) {
      setInventory(prev => prev.map(i => i.id === currentItem.id ? { ...currentItem, price: parseFloat(currentItem.price), stock: parseInt(currentItem.stock) } : i));
    } else {
      setInventory(prev => [...prev, { ...currentItem, id: Date.now(), price: parseFloat(currentItem.price), stock: parseInt(currentItem.stock) }]);
    }
    setIsModalOpen(false);
    setCurrentItem({ name: '', price: '', stock: '', category: '' });
  };

  const deleteItem = (id) => {
    if(window.confirm("Are you sure?")) {
      setInventory(prev => prev.filter(i => i.id !== id));
    }
  };

  const openEdit = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setCurrentItem({ name: '', price: '', stock: '', category: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7e2fed]/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {role !== 'cashier' && (
          <Button onClick={openAdd} icon={Plus}>Add New Item</Button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Product Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                {role !== 'cashier' && <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="p-4 font-medium text-gray-700">{item.name}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="p-4 text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-gray-600">{item.stock}</td>
                  <td className="p-4">
                    {item.stock < 10 
                      ? <Badge type="danger">Low Stock</Badge>
                      : <Badge type="success">In Stock</Badge>
                    }
                  </td>
                  {role !== 'cashier' && (
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
            <div className="p-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">{isEditing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Product Name</label>
                <input required className="w-full p-2 rounded-lg border focus:border-purple-400 outline-none" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full p-2 rounded-lg border focus:border-purple-400 outline-none" value={currentItem.price} onChange={e => setCurrentItem({...currentItem, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Stock Qty</label>
                  <input required type="number" className="w-full p-2 rounded-lg border focus:border-purple-400 outline-none" value={currentItem.stock} onChange={e => setCurrentItem({...currentItem, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Category</label>
                <select className="w-full p-2 rounded-lg border focus:border-purple-400 outline-none bg-white" value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                  <option value="">Select Category</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div className="pt-4">
                <Button className="w-full justify-center">{isEditing ? 'Update Product' : 'Create Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// BILLING SYSTEM
const BillingSystem = ({ inventory, setInventory, onCompleteSale }) => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const addToCart = (item) => {
    if (item.stock <= 0) return alert("Out of stock!");
    const existing = cart.find(c => c.id === item.id);
    const currentQtyInCart = existing ? existing.qty : 0;
    if (currentQtyInCart + 1 > item.stock) return alert("Not enough stock available!");

    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        const inventoryItem = inventory.find(i => i.id === id);
        if (newQty > inventoryItem.stock) {
          alert("Max stock reached");
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // 1. Call "C++" API to update stock
    for (const item of cart) {
      await BackendAPI.updateStock(item.id, item.qty);
    }

    // 2. Update Local React State
    const newInventory = inventory.map(item => {
      const cartItem = cart.find(c => c.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.qty };
      }
      return item;
    });
    setInventory(newInventory);

    onCompleteSale({
      id: Date.now(),
      items: cart,
      total: total,
      date: new Date().toISOString()
    });

    setCart([]);
    setSuccessMsg("Payment Successful! Invoice Generated.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const filteredProducts = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-4 sticky top-0 bg-[#FDFDFD] z-10 py-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Scan barcode or search item..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A8D5E3]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
           </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-[#A8D5E3] group relative overflow-hidden ${item.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="h-24 w-full bg-gray-50 rounded-lg mb-3 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                {item.category === 'Stationery' ? '✏️' : item.category === 'Electronics' ? '💡' : '🍵'}
              </div>
              <h4 className="font-bold text-gray-700 truncate">{item.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#7e2fed] font-bold">${item.price}</span>
                <span className="text-xs text-gray-400">{item.stock} left</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2"><ShoppingCart size={18}/> Current Order</h3>
          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">#{Math.floor(Math.random() * 10000)}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
               <ShoppingCart size={48} className="opacity-20" />
               <p>Cart is empty</p>
             </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-700 text-sm">{item.name}</h5>
                  <p className="text-xs text-gray-400">${item.price} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">-</button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 space-y-3">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
          
          <Button onClick={handleCheckout} variant="primary" className="w-full justify-center py-3 mt-4 shadow-lg shadow-pink-200">
             {successMsg ? <CheckCircle /> : 'Process Payment'}
          </Button>
          {successMsg && <p className="text-center text-xs text-green-600 font-medium animate-pulse">{successMsg}</p>}
        </div>
      </div>
    </div>
  );
};

// MAIN APP
export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([
    { id: 101, total: 120.50, date: '2023-10-01' },
    { id: 102, total: 45.00, date: '2023-10-02' }
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulate loading initial data from C++
  useEffect(() => {
    BackendAPI.fetchInventory().then(data => setInventory(data));
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setView(role === 'cashier' ? 'billing' : 'dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setView('dashboard');
  };

  const handleCompleteSale = (saleData) => {
    setSalesHistory(prev => [saleData, ...prev]);
  };

  const navItems = useMemo(() => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
      { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'manager', 'cashier'] },
      { id: 'billing', label: 'Billing & POS', icon: ShoppingCart, roles: ['admin', 'cashier'] },
      { id: 'users', label: 'Staff', icon: Users, roles: ['admin'] },
      { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'manager'] },
    ];
    return items.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-[#374151] overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
      `}>
        <div className="h-20 flex items-center px-8 border-b border-gray-50">
           <div className="w-8 h-8 bg-[#7e2fed] rounded-lg flex items-center justify-center mr-3">
             <span className="text-white font-bold">S</span>
           </div>
           <h1 className="text-xl font-bold bg-gradient-to-r from-[#7e2fed] to-[#A8D5E3] bg-clip-text text-transparent">SmartInv</h1>
        </div>

        <div className="p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${view === item.id 
                  ? `bg-[${THEME.colors.secondary}]/20 text-[${THEME.colors.primary}] shadow-sm` 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }
              `}
              style={view === item.id ? { backgroundColor: '#EFF6FF', color: '#7e2fed' } : {}}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-blue-300"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-700 truncate">Lucky Kumar</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400"><LogOut size={18}/></button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-50 flex items-center justify-between px-6 lg:px-10 z-20">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-500"><Menu/></button>
             <h2 className="text-xl font-bold text-gray-800 capitalize">{view.replace('-', ' ')}</h2>
           </div>
           <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors relative">
                <AlertCircle size={20}/>
                {inventory.filter(i => i.stock < 10).length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
           </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {view === 'dashboard' && <Dashboard inventory={inventory} salesHistory={salesHistory} />}
          {view === 'inventory' && <InventoryManager inventory={inventory} setInventory={setInventory} role={userRole} />}
          {view === 'billing' && <BillingSystem inventory={inventory} setInventory={setInventory} onCompleteSale={handleCompleteSale} />}
          {view === 'users' && <div className="flex items-center justify-center h-full text-gray-400">Staff Management Module (Coming Soon)</div>}
          {view === 'reports' && <div className="flex items-center justify-center h-full text-gray-400">Advanced Reports Module (Coming Soon)</div>}
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}