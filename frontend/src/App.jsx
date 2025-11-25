import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
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
  X,
  Receipt,
  ArrowLeft,
  Calendar,
  Languages
} from 'lucide-react';

// --- 1. INTERNAL TRANSLATION SYSTEM (Updated with Chinese & Arabic) ---

const translations = {
  en: {
    "welcome": "Welcome Back!",
    "subtitle": "SIMBAT Inventory System",
    "select_role": "Select Role to Demo:",
    "dashboard": "Dashboard",
    "inventory": "Inventory",
    "billing": "Billing & POS",
    "bills": "Bill History",
    "staff": "Staff",
    "reports": "Reports",
    "total_revenue": "Total Revenue",
    "total_products": "Total Products",
    "low_stock_alerts": "Low Stock Alerts",
    "sales_overview": "Sales Overview",
    "items_restock": "Items need restocking",
    "stock_left": "left",
    "create_bill": "Create Bill",
    "process_payment": "Process Payment",
    "grand_total": "Grand Total",
    "action_needed": "Action Needed",
    "search_placeholder": "Scan barcode or search item..."
  },
  zh: {
    "welcome": "欢迎回来！",
    "subtitle": "SIMBAT 库存系统",
    "select_role": "选择演示角色：",
    "dashboard": "仪表板",
    "inventory": "库存",
    "billing": "账单和POS",
    "bills": "账单历史",
    "staff": "员工",
    "reports": "报告",
    "total_revenue": "总收入",
    "total_products": "产品总数",
    "low_stock_alerts": "低库存警报",
    "sales_overview": "销售概览",
    "items_restock": "物品需要补货",
    "stock_left": "剩余",
    "create_bill": "创建账单",
    "process_payment": "处理付款",
    "grand_total": "总计",
    "action_needed": "需要采取行动",
    "search_placeholder": "扫描条形码或搜索物品..."
  },
  ar: {
    "welcome": "مرحبًا بعودتك!",
    "subtitle": "نظام جرد SIMBAT",
    "select_role": "اختر دورًا للعرض التوضيحي:",
    "dashboard": "لوحة القيادة",
    "inventory": "المخزون",
    "billing": "الفواتير ونقاط البيع",
    "bills": "سجل الفواتير",
    "staff": "الموظفين",
    "reports": "التقارير",
    "total_revenue": "إجمالي الإيرادات",
    "total_products": "إجمالي المنتجات",
    "low_stock_alerts": "تنبيهات انخفاض المخزون",
    "sales_overview": "نظرة عامة على المبيعات",
    "items_restock": "عناصر تحتاج إلى إعادة تخزين",
    "stock_left": "المتبقي",
    "create_bill": "إنشاء فاتورة",
    "process_payment": "معالجة الدفع",
    "grand_total": "المجموع الإجمالي",
    "action_needed": "الإجراء مطلوب",
    "search_placeholder": "مسح الباركود أو البحث عن عنصر..."
  },
  jp: {
    "welcome": "おかえりなさい！",
    "subtitle": "SIMBAT 在庫システム",
    "select_role": "デモの役割を選択:",
    "dashboard": "ダッシュボード",
    "inventory": "在庫",
    "billing": "会計 & POS",
    "bills": "請求履歴",
    "staff": "スタッフ",
    "reports": "レポート",
    "total_revenue": "総収益",
    "total_products": "総製品数",
    "low_stock_alerts": "在庫不足アラート",
    "sales_overview": "売上概要",
    "items_restock": "補充が必要です",
    "stock_left": "残り",
    "create_bill": "請求書作成",
    "process_payment": "支払処理",
    "grand_total": "総計",
    "action_needed": "要対応",
    "search_placeholder": "バーコードスキャンまたは検索..."
  }
};

// Create Context
const LanguageContext = createContext();

// Language Provider Component
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    // Basic RTL support for Arabic
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ t, changeLanguage, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook to use translation
const useTranslation = () => useContext(LanguageContext);


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
const BackendAPI = {
  fetchInventory: async () => {
    console.log("Connecting to C++ Backend: Calling getInventory()...");
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
      { id: 1, name: 'Pastel Notebook', price: 12.50, stock: 45, category: 'Stationery' },
      { id: 2, name: 'Gel Pen Set', price: 8.00, stock: 12, category: 'Stationery' },
      { id: 3, name: 'Desk Lamp', price: 35.00, stock: 8, category: 'Electronics' },
      { id: 4, name: 'Ceramic Mug', price: 15.00, stock: 24, category: 'Home' },
      { id: 5, name: 'Planner 2025', price: 22.00, stock: 5, category: 'Stationery' },
      // New items matching C++ Backend
      { id: 6, name: 'Cotton T-Shirt', price: 18.00, stock: 30, category: 'Cloths' },
      { id: 7, name: 'Energy Bar', price: 3.50, stock: 60, category: 'Food' },
    ];
  },

  updateStock: async (id, qty) => {
    console.log(`Connecting to C++ Backend: Calling setStockUpdate(${id}, ${qty})...`);
    return { success: true, message: "Stock Updated in C++ Memory" };
  }
};

// --- COMPONENTS ---

const Button = ({ children, variant = 'primary', onClick, className = '', icon: Icon, disabled }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
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
      disabled={disabled}
      className={`${baseStyle} ${className} ${variant === 'ghost' ? 'hover:bg-gray-100' : ''}`}
      style={variant !== 'ghost' ? styleMap[variant] : {}}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', title, highlight, action }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-50 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            {title}
            {highlight && <span className="text-xs px-2 py-1 rounded-full bg-[#FDE68A] text-gray-700 ml-2">{highlight}</span>}
          </h3>
        )}
        {action}
      </div>
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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#A8D5E3] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#7e2fed] opacity-20 blur-3xl"></div>

      <Card className="w-full max-w-md z-10 backdrop-blur-sm bg-white/90">
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden shadow-sm border border-gray-100">
             <img 
               src="/logo.png" 
               alt="SIMBAT Logo" 
               className="w-full h-full object-contain"
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://cdn-icons-png.flaticon.com/512/3753/3753024.png" 
               }}
             />
          </div>
          
          <h1 className="text-5xl font-extrabold text-black tracking-tight">SIMBAT</h1>
          <p className="text-gray-500 mt-2">{t('welcome')}</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-600 mb-2">{t('select_role')}</p>
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
  const { t } = useTranslation();
  const totalRevenue = salesHistory.reduce((acc, curr) => acc + curr.total, 0);
  const lowStockItems = inventory.filter(i => i.stock < 10);
  
  const [salesDuration, setSalesDuration] = useState('Weekly');

  const chartData = useMemo(() => {
    if (salesDuration === 'Weekly') {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });

      const labels = last7Days.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));
      
      const data = last7Days.map(day => {
        const dayStr = day.toDateString();
        return salesHistory
          .filter(sale => new Date(sale.date).toDateString() === dayStr)
          .reduce((sum, sale) => sum + sale.total, 0);
      });

      return { labels, data };
    }

    switch(salesDuration) {
      case 'Daily':
        return {
          data: [15, 25, 20, 35, 30, 45, 40],
          labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
        };
      case 'Monthly':
        return {
          data: [200, 450, 300, 600, 550, 700, 800],
          labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 1', 'Wk 2', 'Wk 3']
        };
      case 'Yearly':
        return {
          data: [1200, 1900, 1500, 2200, 2800, 2400, 3100],
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        };
      default:
        return { data: [], labels: [] };
    }
  }, [salesDuration, salesHistory]);

  const Chart = () => (
    <div className="flex items-end gap-2 h-40 mt-8 mb-2">
      {chartData.data.map((h, i) => {
        const max = Math.max(...chartData.data, 1); 
        const heightPercentage = (h / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
             <div 
               className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative bg-blue-100"
               style={{ 
                 height: `${heightPercentage || 5}%`, 
                 backgroundColor: h > 0 ? (i % 2 === 0 ? THEME.colors.primary : THEME.colors.secondary) : '#E5E7EB' 
               }}
             >
                {h > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs font-bold">
                    ${h.toFixed(0)}
                  </div>
                )}
             </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><DollarSign size={100} /></div>
          <p className="text-gray-500 text-sm">{t('total_revenue')}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">${totalRevenue.toFixed(2)}</h2>
          <Badge type="success" className="mt-2 inline-block">+12.5% from last week</Badge>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><Package size={100} /></div>
          <p className="text-gray-500 text-sm">{t('total_products')}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{inventory.length}</h2>
          <span className="text-xs text-gray-400">Active Inventory</span>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10"><AlertCircle size={100} /></div>
          <p className="text-gray-500 text-sm">{t('low_stock_alerts')}</p>
          <h2 className="text-3xl font-bold text-[#EF4444] mt-2">{lowStockItems.length}</h2>
          <span className="text-xs text-gray-400">{t('items_restock')}</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title={`${salesDuration} ${t('sales_overview')}`}
          action={
            <div className="relative">
              <select 
                value={salesDuration}
                onChange={(e) => setSalesDuration(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#7e2fed] focus:border-[#7e2fed] block w-full p-2 pr-8 cursor-pointer outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Calendar size={14} />
              </div>
            </div>
          }
        >
          <Chart />
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            {chartData.labels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </Card>

        <Card title={t('low_stock_alerts')} highlight={t('action_needed')}>
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
                  <span className="text-red-600 font-bold text-sm">{item.stock} {t('stock_left')}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// BILLS VIEWER
const BillsViewer = ({ salesHistory }) => {
  const { t } = useTranslation();
  const [selectedBill, setSelectedBill] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="text-[#7e2fed]" /> {t('bills')}
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bill List */}
        <div className={`${selectedBill ? 'hidden lg:block lg:w-1/2' : 'w-full'} bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Bill ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salesHistory.map(bill => (
                <tr key={bill.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-700">#{bill.id}</td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(bill.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-[#7e2fed]">${bill.total.toFixed(2)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedBill(bill)}
                      className="px-3 py-1 bg-purple-100 text-[#7e2fed] rounded-lg text-sm font-medium hover:bg-[#7e2fed] hover:text-white transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {salesHistory.length === 0 && (
            <div className="p-8 text-center text-gray-400">No bills generated yet.</div>
          )}
        </div>

        {/* Bill Detail View */}
        {selectedBill && (
          <div className="w-full lg:w-1/2 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Receipt size={120} /></div>
              <button onClick={() => setSelectedBill(null)} className="lg:hidden mb-4 flex items-center gap-2 text-gray-500"><ArrowLeft size={16}/> Back</button>
              
              <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Invoice #{selectedBill.id}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedBill.date).toLocaleString()}</p>
              </div>

              <div className="space-y-3 mb-6">
                {selectedBill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-xs text-gray-400">${item.price} x {item.qty}</p>
                    </div>
                    <span className="font-medium text-gray-600">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>{t('grand_total')}</span>
                  <span className="text-[#7e2fed]">${selectedBill.total.toFixed(2)}</span>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button className="w-full justify-center" icon={CheckCircle}>Paid</Button>
                  <Button variant="outline" className="w-full justify-center" icon={FileText} onClick={() => window.print()}>Print</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// INVENTORY MANAGER
const InventoryManager = ({ inventory, setInventory, role }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ name: '', price: '', stock: '', category: '' });
  const [isEditing, setIsEditing] = useState(false);

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
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
            placeholder={t('search_placeholder')}
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
                      ? <Badge type="danger">{t('items_restock')}</Badge>
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
                  <option value="Cloths">Cloths</option>
                  <option value="Food">Food</option>
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
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  const [billStage, setBillStage] = useState('cart'); // 'cart' | 'preview'

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

  const handleCreateBill = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setBillStage('preview');
  };

  const handleProcessPayment = async () => {
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
    setBillStage('cart');
    setSuccessMsg("Payment Successful! Invoice Generated.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const filteredProducts = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* LEFT: Product Grid (Only show in Cart Mode) */}
      <div className={`flex-1 overflow-y-auto pr-2 ${billStage === 'preview' ? 'hidden lg:block lg:opacity-50 lg:pointer-events-none' : ''}`}>
        <div className="mb-4 sticky top-0 bg-[#FDFDFD] z-10 py-2">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
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
                <span className="text-xs text-gray-400">{item.stock} {t('stock_left')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Cart / Bill Preview */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            {billStage === 'preview' ? <Receipt size={18}/> : <ShoppingCart size={18}/>} 
            {billStage === 'preview' ? 'Bill Summary' : 'Current Order'}
          </h3>
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
                {billStage === 'cart' ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                ) : (
                  <span className="font-bold text-gray-700">${(item.price * item.qty).toFixed(2)}</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 space-y-3">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
          
          {billStage === 'cart' ? (
            <Button onClick={handleCreateBill} variant="primary" className="w-full justify-center py-3 mt-4 shadow-lg shadow-pink-200" disabled={cart.length === 0}>
               {t('create_bill')}
            </Button>
          ) : (
            <div className="space-y-2 mt-4">
              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-xs text-yellow-700 mb-2">
                ⚠️ Please confirm items before processing payment.
              </div>
              <Button onClick={handleProcessPayment} variant="primary" className="w-full justify-center py-3 shadow-lg shadow-pink-200">
                 {t('process_payment')}
              </Button>
              <Button onClick={() => setBillStage('cart')} variant="ghost" className="w-full justify-center">
                 Back to Edit
              </Button>
            </div>
          )}
          
          {successMsg && <p className="text-center text-xs text-green-600 font-medium animate-pulse">{successMsg}</p>}
        </div>
      </div>
    </div>
  );
};

// WRAPPER FOR PREVIEW
const AppWrapper = () => {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

// MAIN APP
const App = () => {
  const { t, changeLanguage, language } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([
    // DYNAMIC INITIAL DATES: These will now show up on the chart as "Today" and "Yesterday"
    { id: 101, total: 120.50, date: new Date().toISOString(), items: [{name: 'Notebook', price: 12.5, qty: 10}] },
    { id: 102, total: 45.00, date: new Date(Date.now() - 86400000).toISOString(), items: [{name: 'Gel Pen', price: 8, qty: 5}] }
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
      { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'manager'] },
      { id: 'inventory', label: t('inventory'), icon: Package, roles: ['admin', 'manager', 'cashier'] },
      { id: 'billing', label: t('billing'), icon: ShoppingCart, roles: ['admin', 'cashier'] },
      { id: 'bills', label: t('bills'), icon: FileText, roles: ['admin', 'manager', 'cashier'] }, // Added Bills section
      { id: 'users', label: t('staff'), icon: Users, roles: ['admin'] },
      { id: 'reports', label: t('reports'), icon: TrendingUp, roles: ['admin', 'manager'] },
    ];
    return items.filter(item => item.roles.includes(userRole));
  }, [userRole, t]);

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
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 relative overflow-hidden border border-gray-100 shadow-sm">
             {/* CUSTOM LOGO */}
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-full h-full object-contain"
               onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3753/3753024.png" }}
             />
           </div>
           <h1 className="text-xl font-bold bg-gradient-to-r from-[#7e2fed] to-[#A8D5E3] bg-clip-text text-transparent">SIMBAT</h1>
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

        <div className="p-4">
          <div className="relative">
            <select 
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full p-2 pl-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm appearance-none cursor-pointer"
              defaultValue={language}
            >
              <option value="en">English</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="jp">日本語 (Japanese)</option>
            </select>
            <Languages className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
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
          {view === 'bills' && <BillsViewer salesHistory={salesHistory} />}
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
};

export default AppWrapper;