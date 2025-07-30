'use client'
import { useState, useEffect } from 'react';
import { useappstore } from '../store';
import ActiveDeliveryMap from '../components/ActiveDeliveryMap';
import { 
  Star, Upload, Eye, Package, TrendingUp, UserPlus, LogIn, LogOut,
  CheckCircle, Settings, Truck, MapPin, Clock, X, Check, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';

const DeliveryPartners = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  
  // Location states
  const [address, setAddress] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  
  // Order states
  const {deliveryinfo,setdeliveryinfo}=useappstore();
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [newOrders, setNewOrders] = useState([]);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const [deliveries, setDeliveries] = useState([]);

  // Stats data
  const [stats, setStats] = useState([
    { label: 'Today', value: 0, icon: Package },
    { label: 'Earnings', value: '₹0', icon: TrendingUp },
    { label: 'Rating', value: '0.0', icon: Star },
    { label: 'Active', value: 0, icon: Truck },
  ]);

  // Content data
  const whyJoin = [
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work when you want without restrictions.' },
    { icon: TrendingUp, title: 'High Earnings', desc: 'Get paid per delivery plus bonuses.' },
    { icon: MapPin, title: 'Familiar Routes', desc: 'Deliver in areas you already know.' },
  ];

  // Calculate distance between coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // Handle location fetching
  const handleGetLocation = () => {
    if (!isClient) return;
    
    setLocationStatus('Fetching location...');
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          setAddress(data.display_name);
          setLocationStatus('Location found!');
        } catch (err) {
          setLocationStatus('Failed to fetch address.');
        }
      },
      () => setLocationStatus('Unable to retrieve your location.')
    );
  };

  // Authentication handlers
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

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if(data.user.role !== 'delivery_partner') {
        alert('You are not authorized to access this portal as a delivery partner.');
        return;
      }
      
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
      await fetchOrders();
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setDeliveries([]);
    setNewOrders([]);
  };

  // Fetch orders from backend
  const fetchOrders = async (parsedData) => {
    console.log(parsedData,parsedData?.id);
    const user = parsedData || user;

    if (!user || !user.id) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/delivery-partners?delivery_partner_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const orderdata = await response.json();
      const data=orderdata.data;
      console.log(data);
      // Separate new and completed deliveries
      const pending = data.filter(order => order.completed === false);
      const completed = data.filter(order => order.completed !== false);
      setNewOrders(pending);
      setDeliveries(data);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayDeliveries = data.filter(d => 
        new Date(d.created_at).toISOString().split('T')[0] === today
      );
      
      const totalEarnings = completed.reduce((sum, order) => 
        sum + parseInt(order.delivery_price.replace('₹', '')), 0
      );
      
      setStats([
        { label: 'Today', value: todayDeliveries.length, icon: Package },
        { label: 'Earnings', value: `₹${totalEarnings}`, icon: TrendingUp },
        { label: 'Rating', value: '4.9', icon: Star },
        { label: 'Active', value: pending.length, icon: Truck },
      ]);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle order acceptance
const handleAcceptOrder = async (order) => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    const response = await fetch(`/api/delivery-partners?order_id=${order.id}&delivery_partner_id=${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        delivery_partner_id: user.id,
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to accept order');
    }

    const updatedOrder = await response.json();

    setAcceptedOrder(updatedOrder);
    setDeliveries(prev =>
      prev.map(o => o.id === order.id ? updatedOrder : o)
    );
    setNewOrders(prev => prev.filter(o => o.id !== order.id));
  } catch (error) {
    console.error('Error accepting order:', error);
    alert('Failed to accept order. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  // Handle order completion
  const handleCompleteOrder = async (orderId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/delivery-partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to complete order');
      }

      const updatedOrder = await response.json();
      setAcceptedOrder(null);
      setDeliveries(prev => 
        prev.map(o => o.id === orderId ? updatedOrder : o)
      );
      
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const newAvailability = !isAvailable;
      
      const response = await fetch(`/api/delivery-partners`, {
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
    console.log('User Data:', userData);
    const parsedData = JSON.parse(userData);
    console.log("Parsed Delivery Info:", parsedData);
    setdeliveryinfo(parsedData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'delivery_partner') {
          setUser(parsedUser);
          setIsAvailable(parsedUser.availability || false);
          setIsLoggedIn(true);
          fetchOrders(parsedData);
        } else {
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
    
    setIsClient(true);
    setIsInitializing(false);
  }, []);

  // Request notification permission
  useEffect(() => {
    if (!isClient) return;
    if (window.Notification) {
      Notification.requestPermission();
    }
  }, [isClient]);

  if (!isClient || isInitializing) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl">
      <Head>
        <title>iStitch - Delivery Partner Portal</title>
        <meta name="description" content="Join our network of delivery partners and earn flexibly" />
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

      {/* New Order Popup */}
      {showOrderPopup && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-navy">New Delivery Nearby</h3>
              <button 
                onClick={() => {
                  setShowOrderPopup(false);
                  setCurrentOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-navy">
              <div className="flex items-center gap-2">
                <Package className="text-gold w-5 h-5" />
                <p><strong>Order ID:</strong> #{currentOrder.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="text-gold w-5 h-5" />
                <p><strong>Customer:</strong> {currentOrder.customer}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-gold w-5 h-5" />
                <p><strong>Address:</strong> {currentOrder.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="text-gold w-5 h-5" />
                <p><strong>Distance:</strong> {currentOrder.distance} from you</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-gold w-5 h-5" />
                <p><strong>Earnings:</strong> {currentOrder.earnings}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-gold w-5 h-5" />
                <p><strong>Deadline:</strong> {currentOrder.time}</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowOrderPopup(false);
                  setCurrentOrder(null);
                }}
                className="flex-1 py-2 border border-navy text-navy rounded-lg font-medium hover:bg-navy/10 transition"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  handleAcceptOrder(currentOrder);
                  setShowOrderPopup(false);
                }}
                className="flex-1 py-2 bg-gold text-navy rounded-lg font-medium hover:bg-gold/80 transition"
              >
                Accept Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard (when logged in) */}
      {isLoggedIn && user ? (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
          {/* Dashboard Header with Availability Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">Delivery Partner Dashboard</h2>
              <p className="text-navy/70">Welcome back, {deliveryinfo?.full_name || 'Partner'}!</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAvailable ? (
                  <>
                    <Check size={16} /> Available
                  </>
                ) : (
                  <>
                    <X size={16} /> Unavailable
                  </>
                )}
              </span>
              <button
                onClick={toggleAvailability}
                className="bg-gold/70 text-navy px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gold-light transform hover:scale-105 transition-all duration-300"
                disabled={isLoading}
              >
                {isAvailable ? 'Go Offline' : 'Go Online'}
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
                    label === 'Today' ? 'bg-blue-50 text-blue-600' :
                    label === 'Earnings' ? 'bg-green-50 text-green-600' :
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

          {/* Order Management Tabs */}
          <div className="flex border-b border-navy/20">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'available' 
                  ? 'text-navy border-b-2 border-gold' 
                  : 'text-navy/70 hover:text-navy'
              }`}
              onClick={() => setActiveTab('available')}
            >
              Available Orders
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'text-navy border-b-2 border-gold' 
                  : 'text-navy/70 hover:text-navy'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Delivery History
            </button>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-sm border border-navy/10 overflow-hidden">
            {activeTab === 'available' ? (
              <>
                <div className="p-4 border-b border-navy/10">
                  <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
                    <Package size={18} /> Available Orders ({deliveries.filter(d => d.completed === false).length})
                  </h3>
                </div>
                
                {deliveries.filter(d => d.completed === false).length === 0 ? (
                  <div className="p-8 text-center text-navy/70">
                    <p>No available orders right now</p>
                    <p className="text-sm mt-1">New orders will appear here when available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-navy/10">
                    {deliveries.filter(d => d.completed === false).map((order) => (
                      <div key={order.id} className="p-4 hover:bg-pearl/50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-medium text-navy">#{order.id} • {order.full_name}</p>
                            <p className="text-sm text-navy/70">{order.address}</p>
                            <div className="flex items-center gap-3">
                              <p className="text-xs text-navy/70 flex items-center gap-1">
                                <Clock size={14} /> Deadline: {new Date(order.created_at).toLocaleString('en-IN', {dateStyle: 'medium',timeStyle: 'short'})}
                              </p>
                              <p className="text-xs text-navy/70 flex items-center gap-1">
                                <TrendingUp size={14} /> {order.delivery_price}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            className="bg-gold text-navy px-4 py-2 rounded-lg font-medium hover:bg-gold/80 transition whitespace-nowrap"
                            disabled={isLoading}
                          >
                            Accept Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-4 border-b border-navy/10">
                  <h3 className="text-lg font-semibold text-navy flex items-center gap-2">
                    <CheckCircle size={18} /> Delivery History ({deliveries.filter(d => d.completed !== false).length})
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-navy/5">
                      <tr>
                        <th className="py-3 px-4 text-left text-navy font-medium">Order ID</th>
                        <th className="py-3 px-4 text-left text-navy font-medium">Customer</th>
                        <th className="py-3 px-4 text-left text-navy font-medium">Status</th>
                        <th className="py-3 px-4 text-left text-navy font-medium">Earnings</th>
                        <th className="py-3 px-4 text-left text-navy font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/10">
                      {deliveries.filter(d => d.completed !== false).map((order) => (
                        <tr key={order.id} className="hover:bg-pearl/50">
                          <td className="py-3 px-4 text-navy">#{order.id}</td>
                          <td className="py-3 px-4 text-navy">{order.full_name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-navy font-medium">{order.delivery_price}</td>
                          <td className="py-3 px-4 text-navy/70">{new Date(order.created_at).toLocaleString('en-IN', {dateStyle: 'medium',timeStyle: 'short'})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Active Delivery Map */}
          {acceptedOrder && (
            <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 relative">
                <button
                  onClick={() => setAcceptedOrder(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>

                <ActiveDeliveryMap 
                  order={acceptedOrder}
                  onDelivered={() => handleCompleteOrder(acceptedOrder.id)}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Login Form */}
          {showLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-navy mb-6">Delivery Partner Login</h2>
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
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Delivery Partner Portal</h1>
                  <p className="text-lg mb-8">Login to access your delivery partner dashboard</p>
                  <button 
                    onClick={() => setShowLogin(true)} 
                    className="bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:bg-gold/90 transition"
                  >
                    Login
                  </button>
                </div>
              </section>

              {/* Why Join Section */}
              <section className="py-16 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-navy mb-12">Why Join iStitch?</h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </section>

              {/* Requirements Section */}
              <section className="py-16 px-4 bg-pearl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-navy mb-12">Requirements</h2>
                <div className="max-w-4xl mx-auto space-y-6 text-navy">
                  {[
                    "Must be at least of Age 18 or above",
                    "Valid driver's license and vehicle documents",
                    "Must have a smartphone or access to the internet to manage orders online",
                    "Background verification",
                    "Should be able to communicate with customers in a professional and polite manner"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <CheckCircle className="text-gold w-6 h-6 mt-1" />
                      <p>{requirement}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryPartners;