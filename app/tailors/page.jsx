'use client'
import { useState, useEffect } from 'react';
import { 
  Star, Upload, Eye, Package, TrendingUp, UserPlus, 
  CheckCircle, Settings, Clock, Check, X, ChevronDown, ChevronUp, Loader2, LogOut
} from 'lucide-react';
import Head from 'next/head';
import { useappstore } from '../store';

const Tailors = () => {
  const {tailorinfo,settailorinfo}=useappstore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  
  // Orders data
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [earning, setearning] = useState(0);
  // Stats data
  const [stats, setStats] = useState([
    { label: 'Active', value: 0, icon: Package },
    { label: 'Completed', value: 0, icon: CheckCircle },
    { label: 'Rating', value: '0.0', icon: Star },
    { label: 'Earnings', value: earning, icon: TrendingUp },
  ]);

  // Why Join data
  const whyJoin = [
    { title: 'Earn More', desc: 'Get more orders with zero commission.', icon: TrendingUp },
    { title: 'Work on Your Terms', desc: 'Choose the orders and timings you prefer.', icon: Settings },
    { title: 'Showcase Your Talent', desc: 'Build your online presence and attract more clients.', icon: Star },
  ];

  // Calculate average rating
  const calculateAverageRating = (orders) => {
    if (orders.length === 0) return '0.0';
    const total = orders.reduce((sum, order) => sum + (order.rating || 0), 0);
    return (total / orders.length).toFixed(1);
  };

  // Calculate earnings
  const calculateEarnings = (orders) => {
    if (orders.length === 0) return '₹0';
    const total = orders.reduce((sum, order) => sum + (order.stitching_price || 0), 0);
    return `₹${total.toLocaleString('en-IN')}`;
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    if (!user || !user.id) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ordersadmin?tailor_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Separate active and completed orders
      const active = data.filter(order => order.status !== 'Completed' && order.status !== 'Ready for Delivery');
      const history = data.filter(order => order.status === 'Completed' || order.status === 'Ready for Delivery');
      
      setActiveOrders(active);
      setOrderHistory(history);
      
      // Update stats
      setStats([
        { label: 'Active', value: active.length, icon: Package },
        { label: 'Completed', value: history.length, icon: CheckCircle },
        { label: 'Rating', value: calculateAverageRating(history), icon: Star },
        { label: 'Earnings', value: calculateEarnings(history), icon: TrendingUp },
      ]);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      //setTailorinfo(response.user)
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      settailorinfo(data.user);
      if(data.user.role !== 'tailor') {
        alert('You are not authorized to access this portal as a tailor.');
        return;
      }
      
      // Store complete user data including name
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        name: data.user.name,
        id: data.user.id,
        availability: data.user.availability || false
      }));
      
      setUser({
        ...data.user,
        name: data.user.name,
        availability: data.user.availability || false
      });
      setIsAvailable(data.user.availability || false);
      setIsLoggedIn(true);
      setShowLogin(false);
      
      // Fetch orders after login
      await fetchOrders();
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setActiveOrders([]);
    setOrderHistory([]);
  };

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ordersadmin', { 
        method: 'PATCH', 
        body: JSON.stringify({ order_id: orderId, status: newStatus }), 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after status change
      await fetchOrders();
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle availability toggle
  const toggleAvailability = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const newAvailability = !isAvailable;
      
      const response = await fetch(`/api/tailors`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId: user.id,
          availability: newAvailability 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      // Update local storage and state
      const updatedUser = {
        ...user,
        availability: newAvailability
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsAvailable(newAvailability);
      
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication state on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    settailorinfo(JSON.parse(userData));
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'tailor') {
          setUser(parsedUser);
          setIsAvailable(parsedUser.availability || false);
          setIsLoggedIn(true);
          fetchOrders();
        } else {
          // Clear invalid user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
    
    setIsInitializing(false);
  }, []);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl">
      <Head>
        <title>iStitch - Tailor Portal</title>
        <meta name="description" content="Join our network of skilled tailors and grow your business" />
      </Head>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="animate-spin text-gold" size={24} />
            <span className="text-navy">Processing...</span>
          </div>
        </div>
      )}

      {/* Dashboard (when logged in) */}
      {isLoggedIn && user ? (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
          {/* Header with Availability Toggle and Logout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy">Tailor Dashboard</h1>
              <p className="text-navy/70">Welcome back, {tailorinfo.full_name || 'Tailor'}!</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAvailable ? (
                  <>
                    <Check size={16} /> Available
                  </>
                ) : (
                  <>
                    <X size={16} /> Not Available
                  </>
                )}
              </span>
              <button
                onClick={toggleAvailability}
                className="bg-gold/70 text-navy px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gold-light transform hover:scale-105 transition-all duration-300"
                disabled={isLoading}
              >
                {isAvailable ? 'Set as Busy' : 'Set as Available'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-navy text-pearl px-3 py-2 rounded-lg font-semibold text-sm hover:bg-navy-light transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(({ label, value, icon: Icon }, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-navy/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    label === 'Active' ? 'bg-blue-50 text-blue-600' :
                    label === 'Completed' ? 'bg-green-50 text-green-600' :
                    label === 'Rating' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-navy/70">{label}</p>
                    <p className="font-semibold text-navy">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-navy/10 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
                <Package size={18} /> Active Orders ({activeOrders.length})
              </h3>
              <button 
                className="text-sm text-gold hover:text-gold-dark font-medium"
                onClick={fetchOrders}
              >
                Refresh
              </button>
            </div>
            
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-navy/70">
                <p>No active orders currently</p>
                <p className="text-sm mt-1">When you accept new orders, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-sm transition border-navy/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-navy">#{order.id} • {order.full_name}</p>
                        <p className="text-sm text-navy/70">{order.items}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Ready for Delivery' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-navy/10 flex justify-between items-center">
                      <p className="text-sm text-navy/70 flex items-center gap-1">
                        <Clock size={14} /> Deadline: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs bg-pearl border border-navy/20 rounded px-2 py-1 focus:ring-1 focus:ring-gold"
                        disabled={isLoading}
                      >
                        <option value="accepted">Accepted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="Ready_for_Delivery">Ready for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-sm border border-navy/10 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
                <Clock size={18} /> Order History ({orderHistory.length})
              </h3>
              <button 
                className="text-sm text-gold hover:text-gold-dark font-medium"
                onClick={fetchOrders}
              >
                Refresh
              </button>
            </div>
            
            {orderHistory.length === 0 ? (
              <div className="text-center py-8 text-navy/70">
                <p>No order history yet</p>
                <p className="text-sm mt-1">Completed orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-sm transition border-navy/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-navy">#{order.id} • {order.customer_name}</p>
                        <p className="text-sm text-navy/70">{order.items}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < (order.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-navy/10 flex justify-between items-center">
                      <p className="text-sm text-navy/70">
                        Completed on: {new Date(order.completed_date || order.updated_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium text-navy">
                        ₹{order.price?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Login Form */}
          {showLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-navy mb-6">Tailor Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email" 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">Password</label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="Enter your password" 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-navy text-pearl py-3 rounded-lg font-semibold hover:bg-navy-light transition flex justify-center items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                    Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Landing Page (when not showing login form) */}
          {!showLogin && (
            <>
              {/* Hero Section */}
              <section className="bg-navy text-pearl py-16 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Network of Skilled Tailors</h1>
                  <p className="text-lg mb-8">Grow your business by connecting with customers looking for your expertise</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <button 
                      onClick={() => setShowLogin(true)} 
                      className="bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-gold/90 transition"
                    >
                      Login to Your Account
                    </button>
                  </div>
                </div>
              </section>

              {/* Why Join Section */}
              <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-navy mb-12">Why Join iStitch?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {whyJoin.map(({ title, desc, icon: Icon }, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                          <Icon className="text-gold w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-navy mb-2">{title}</h3>
                        <p className="text-navy/70">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tailors;