'use client';

import { useState } from 'react';
import { 
  Users, Scissors, Truck, Package, PieChart, Settings, 
  Bell, LogOut, Home, DollarSign, MapPin, Clock,
  CheckCircle, XCircle, AlertCircle, Search, Lock,
  Mail, Plus, UserPlus, Truck as TruckIcon
} from 'lucide-react';

const AdminPanel = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showAddTailorModal, setShowAddTailorModal] = useState(false);
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  
  // Form states
  const [newTailor, setNewTailor] = useState({ name: '', email: '', phone: '' });
  const [newDelivery, setNewDelivery] = useState({ name: '', email: '', phone: '' });

  // Data states
  const [stats] = useState([
    { title: 'Total Orders', value: '1,248', icon: Package, change: '+12%', trend: 'up' },
    { title: 'Active Tailors', value: '87', icon: Scissors, change: '+5%', trend: 'up' },
    { title: 'Delivery Partners', value: '42', icon: Truck, change: '-2%', trend: 'down' },
    { title: 'Revenue', value: '₹3,85,000', icon: DollarSign, change: '+18%', trend: 'up' },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-1001', customer: 'Rahul Sharma', tailor: 'Master Stitches', status: 'In Progress', delivery: 'Pending', amount: '₹2,499' },
    { id: 'ORD-1002', customer: 'Priya Patel', tailor: 'Urban Tailors', status: 'Completed', delivery: 'Assigned', amount: '₹1,799' },
    { id: 'ORD-1003', customer: 'Amit Kumar', tailor: '', status: 'Pending', delivery: 'Not Ready', amount: '₹3,200' },
    { id: 'ORD-1004', customer: 'Neha Gupta', tailor: 'Perfect Fit', status: 'Completed', delivery: '', amount: '₹2,100' },
  ]);

  const [users, setUsers] = useState([
    { id: 'CUS-501', name: 'Rahul Sharma', type: 'Customer', joined: '15 Jan 2024', orders: 4 },
    { id: 'TAI-102', name: 'Master Stitches', type: 'Tailor', joined: '10 Dec 2023', orders: 28 },
    { id: 'DEL-205', name: 'Fast Delivery Co.', type: 'Delivery', joined: '5 Jan 2024', orders: 15 },
  ]);

  const [tailors, setTailors] = useState(['Master Stitches', 'Urban Tailors', 'Fashion Hub', 'Perfect Fit']);
  const [deliveryPartners, setDeliveryPartners] = useState(['Fast Delivery Co.', 'Quick Ship', 'Express Logistics']);

  // Authentication handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    console.log('OTP sent to:', email);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsAuthenticated(true);
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  // Partner management functions
  const handleAddTailor = (e) => {
    e.preventDefault();
    if (!newTailor.name) {
      alert('Please enter tailor name');
      return;
    }

    const newTailorId = `TAI-${Math.floor(100 + Math.random() * 900)}`;
    const newTailorEntry = {
      id: newTailorId,
      name: newTailor.name,
      email: newTailor.email,
      phone: newTailor.phone,
      type: 'Tailor',
      joined: new Date().toLocaleDateString(),
      orders: 0
    };
    
    setTailors([...tailors, newTailor.name]);
    setUsers([...users, newTailorEntry]);
    setShowAddTailorModal(false);
    setNewTailor({ name: '', email: '', phone: '' });
    alert(`Tailor ${newTailor.name} added successfully!`);
  };

  const handleAddDeliveryPartner = (e) => {
    e.preventDefault();
    if (!newDelivery.name) {
      alert('Please enter delivery partner name');
      return;
    }

    const newDeliveryId = `DEL-${Math.floor(100 + Math.random() * 900)}`;
    const newDeliveryEntry = {
      id: newDeliveryId,
      name: newDelivery.name,
      email: newDelivery.email,
      phone: newDelivery.phone,
      type: 'Delivery',
      joined: new Date().toLocaleDateString(),
      orders: 0
    };
    
    setDeliveryPartners([...deliveryPartners, newDelivery.name]);
    setUsers([...users, newDeliveryEntry]);
    setShowAddDeliveryModal(false);
    setNewDelivery({ name: '', email: '', phone: '' });
    alert(`Delivery partner ${newDelivery.name} added successfully!`);
  };

  // Order assignment functions
  const handleAssignTailor = (orderId, tailor) => {
    if (!tailor) return;
    
    setRecentOrders(recentOrders.map(order => 
      order.id === orderId ? { ...order, tailor } : order
    ));
    alert(`Tailor ${tailor} assigned to order ${orderId}`);
  };

  const handleAssignDelivery = (orderId, partner) => {
    if (!partner) return;
    
    setRecentOrders(recentOrders.map(order => 
      order.id === orderId ? { ...order, delivery: partner } : order
    ));
    alert(`Delivery partner ${partner} assigned to order ${orderId}`);
  };

  // Authentication UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-navy text-pearl p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gold" />
            <h2 className="text-2xl font-bold">Admin Portal Login</h2>
            <p className="mt-2 text-pearl/80">Secure access to iStitch administration</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-navy text-pearl py-3 rounded-lg font-bold hover:bg-navy/90 transition flex items-center justify-center gap-2"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-navy mb-4">
                  We've sent a 6-digit OTP to <span className="font-medium">{email}</span>. 
                  Please check your inbox and enter it below.
                </p>
                <label className="block text-sm font-medium text-navy mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-center text-xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-navy py-3 rounded-lg font-bold hover:bg-gold/90 transition flex items-center justify-center gap-2"
              >
                Verify & Login
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm text-navy/70 hover:text-navy text-center w-full"
              >
                Use different email
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-pearl">
      {/* Sidebar */}
      <div className="w-64 bg-navy text-pearl p-4 flex flex-col">
        <div className="p-4 mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="text-gold" /> iStitch Admin
          </h1>
        </div>
        
        <nav className="flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'dashboard' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Home size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'orders' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Package size={18} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'customers' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Users size={18} /> Customers
          </button>
          <button 
            onClick={() => setActiveTab('tailors')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'tailors' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Scissors size={18} /> Tailors
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'delivery' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Truck size={18} /> Delivery Partners
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'reports' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <PieChart size={18} /> Reports
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg mb-2 ${activeTab === 'settings' ? 'bg-gold text-navy' : 'hover:bg-navy-light'}`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>
        
        <div className="p-4">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-navy-light"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/50" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-pearl">
              <Bell className="text-navy" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold">A</div>
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <h2 className="text-2xl font-bold text-navy mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-navy/70">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-navy mt-1">{stat.value}</h3>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <stat.icon className={`w-5 h-5 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend === 'up' ? 'Increased' : 'Decreased'} from last month
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-navy">Recent Orders</h3>
                  <button className="text-gold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-navy/70">Order ID</th>
                        <th className="pb-3 text-navy/70">Customer</th>
                        <th className="pb-3 text-navy/70">Tailor</th>
                        <th className="pb-3 text-navy/70">Status</th>
                        <th className="pb-3 text-navy/70">Delivery</th>
                        <th className="pb-3 text-navy/70 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="border-b hover:bg-pearl/50">
                          <td className="py-4 text-navy font-medium">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">{order.tailor || '-'}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'Completed' ? <CheckCircle size={14} /> : 
                               order.status === 'In Progress' ? <Clock size={14} /> : 
                               <AlertCircle size={14} />}
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              order.delivery === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.delivery === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.delivery === 'Delivered' ? <CheckCircle size={14} /> : 
                               order.delivery === 'Assigned' ? <MapPin size={14} /> : 
                               <XCircle size={14} />}
                              {order.delivery || 'Not Ready'}
                            </span>
                          </td>
                          <td className="py-4 text-right font-medium">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-navy">Recent Users</h3>
                  <button className="text-gold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-navy/70">User ID</th>
                        <th className="pb-3 text-navy/70">Name</th>
                        <th className="pb-3 text-navy/70">Type</th>
                        <th className="pb-3 text-navy/70">Joined</th>
                        <th className="pb-3 text-navy/70 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index} className="border-b hover:bg-pearl/50">
                          <td className="py-4 text-navy font-medium">{user.id}</td>
                          <td className="py-4">{user.name}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              user.type === 'Customer' ? 'bg-purple-100 text-purple-800' :
                              user.type === 'Tailor' ? 'bg-amber-100 text-amber-800' :
                              'bg-cyan-100 text-cyan-800'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="py-4">{user.joined}</td>
                          <td className="py-4 text-right">{user.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy">Orders Management</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-navy/70">Order ID</th>
                        <th className="pb-3 text-navy/70">Customer</th>
                        <th className="pb-3 text-navy/70">Tailor</th>
                        <th className="pb-3 text-navy/70">Status</th>
                        <th className="pb-3 text-navy/70">Delivery</th>
                        <th className="pb-3 text-navy/70 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-pearl/50">
                          <td className="py-4 font-medium text-navy">{order.id}</td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">
                            {order.tailor ? (
                              order.tailor
                            ) : (
                              <div className="flex gap-2 items-center">
                                <select
                                  onChange={(e) => handleAssignTailor(order.id, e.target.value)}
                                  className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-gold"
                                  defaultValue=""
                                >
                                  <option value="" disabled>Select Tailor</option>
                                  {tailors.map((tailor) => (
                                    <option key={tailor} value={tailor}>{tailor}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4">
                            {order.status === 'Completed' && !order.delivery ? (
                              <div className="flex gap-2 items-center">
                                <select
                                  onChange={(e) => handleAssignDelivery(order.id, e.target.value)}
                                  className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-gold"
                                  defaultValue=""
                                >
                                  <option value="" disabled>Select Partner</option>
                                  {deliveryPartners.map((partner) => (
                                    <option key={partner} value={partner}>{partner}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <span>{order.delivery || 'Not Ready'}</span>
                            )}
                          </td>
                          <td className="py-4 text-right font-medium">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tailors' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy">Tailors Management</h2>
                <button 
                  onClick={() => setShowAddTailorModal(true)}
                  className="bg-gold text-navy px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gold/90"
                >
                  <UserPlus size={18} /> Add New Tailor
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-navy/70">Tailor ID</th>
                        <th className="pb-3 text-navy/70">Name</th>
                        <th className="pb-3 text-navy/70">Email</th>
                        <th className="pb-3 text-navy/70">Phone</th>
                        <th className="pb-3 text-navy/70">Joined</th>
                        <th className="pb-3 text-navy/70 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.type === 'Tailor').map((tailor) => (
                        <tr key={tailor.id} className="border-b hover:bg-pearl/50">
                          <td className="py-4 font-medium text-navy">{tailor.id}</td>
                          <td className="py-4">{tailor.name}</td>
                          <td className="py-4">{tailor.email || '-'}</td>
                          <td className="py-4">{tailor.phone || '-'}</td>
                          <td className="py-4">{tailor.joined}</td>
                          <td className="py-4 text-right">{tailor.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy">Delivery Partners</h2>
                <button 
                  onClick={() => setShowAddDeliveryModal(true)}
                  className="bg-gold text-navy px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gold/90"
                >
                  <TruckIcon size={18} /> Add New Partner
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-navy/70">Partner ID</th>
                        <th className="pb-3 text-navy/70">Name</th>
                        <th className="pb-3 text-navy/70">Email</th>
                        <th className="pb-3 text-navy/70">Phone</th>
                        <th className="pb-3 text-navy/70">Joined</th>
                        <th className="pb-3 text-navy/70 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.type === 'Delivery').map((partner) => (
                        <tr key={partner.id} className="border-b hover:bg-pearl/50">
                          <td className="py-4 font-medium text-navy">{partner.id}</td>
                          <td className="py-4">{partner.name}</td>
                          <td className="py-4">{partner.email || '-'}</td>
                          <td className="py-4">{partner.phone || '-'}</td>
                          <td className="py-4">{partner.joined}</td>
                          <td className="py-4 text-right">{partner.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'customers' && (
            <div className="p-4">
              <h2 className="text-2xl font-bold text-navy mb-6">Customers Management</h2>
              {/* Customers content would go here */}
            </div>
          )}
        </main>
      </div>

      {/* Add Tailor Modal */}
      {showAddTailorModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div 
      className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl transform transition-all"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-navy">Add New Tailor</h3>
        <button 
          onClick={() => setShowAddTailorModal(false)} 
          className="text-navy/50 hover:text-navy transition-colors"
          aria-label="Close modal"
        >
          <XCircle size={24} />
        </button>
      </div>
      
      <form onSubmit={handleAddTailor} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Tailor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newTailor.name}
            onChange={(e) => setNewTailor({...newTailor, name: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            placeholder="John Doe"
            required
            minLength={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Email</label>
            <input
              type="email"
              value={newTailor.email}
              onChange={(e) => setNewTailor({...newTailor, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              placeholder="tailor@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Phone</label>
            <input
              type="tel"
              value={newTailor.phone}
              onChange={(e) => setNewTailor({...newTailor, phone: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              placeholder="+1234567890"
              pattern="[0-9]{10,15}"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {['Dresses', 'Suits', 'Alterations', 'Repairs', 'Custom'].map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => toggleSpecialization(specialty)}
                className={`px-3 py-1 text-sm rounded-full ${
                  newTailor.specializations.includes(specialty)
                    ? 'bg-gold text-navy'
                    : 'bg-pearl text-navy border border-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="is-available"
            type="checkbox"
            checked={newTailor.is_available}
            onChange={(e) => setNewTailor({...newTailor, is_available: e.target.checked})}
            className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
          />
          <label htmlFor="is-available" className="ml-2 block text-sm text-navy">
            Currently Available
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowAddTailorModal(false)}
            className="px-5 py-2.5 border border-navy/20 text-navy rounded-lg hover:bg-navy/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!newTailor.name} // Disable if required fields not filled
            className="px-5 py-2.5 bg-gold text-navy rounded-lg hover:bg-gold/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            {isSubmitting ? 'Adding...' : 'Add Tailor'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Add Delivery Partner Modal */}
      {showAddDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-navy">Add New Delivery Partner</h3>
              <button onClick={() => setShowAddDeliveryModal(false)} className="text-navy/70 hover:text-navy">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddDeliveryPartner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Partner Name*</label>
                <input
                  type="text"
                  value={newDelivery.name}
                  onChange={(e) => setNewDelivery({...newDelivery, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Email</label>
                <input
                  type="email"
                  value={newDelivery.email}
                  onChange={(e) => setNewDelivery({...newDelivery, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Phone</label>
                <input
                  type="tel"
                  value={newDelivery.phone}
                  onChange={(e) => setNewDelivery({...newDelivery, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDeliveryModal(false)}
                  className="px-4 py-2 border border-navy text-navy rounded-lg hover:bg-navy/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 flex items-center gap-2"
                >
                  <Plus size={18} /> Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;