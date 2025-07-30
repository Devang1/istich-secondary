'use client';
import { useState, useEffect } from 'react';
import { Plus, Check, X, Truck, Scissors, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [tailor, setTailor] = useState({ 
    name: '',
    email: '', 
    address: '', 
    experience_years: '', 
    city: '', 
    specializations: '',
    phone_no: '' 
  });
  const [partner, setPartner] = useState({
    name: '', 
    email: '', 
    vehicle_type: '', 
    city: '', 
    phone_no: '' 
  });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState({
    orders: true,
    tailor: false,
    partner: false
  });
  const [success, setSuccess] = useState({
    tailor: false,
    partner: false
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/ordersadmin');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };
    fetchOrders();
  }, []);

  const addTailor = async () => {
    setLoading(prev => ({ ...prev, tailor: true }));
    try {
      const body = { 
        ...tailor, 
        specializations: tailor.specializations.split(',').map(s => s.trim()) 
      };
      const res = await fetch('/api/tailors', { 
        method: 'POST', 
        body: JSON.stringify(body), 
        headers: { 'Content-Type': 'application/json' } 
      });
      const data = await res.json();
      if (data.id) {
        setSuccess(prev => ({ ...prev, tailor: true }));
        setTimeout(() => setSuccess(prev => ({ ...prev, tailor: false })), 3000);
        setTailor({ name:'',email: '', address: '', experience_years: '', city: '', specializations: '', phone_no: '' });
      }
    } catch (error) {
      console.error('Error adding tailor:', error);
    } finally {
      setLoading(prev => ({ ...prev, tailor: false }));
    }
  };

  const addPartner = async () => {
    setLoading(prev => ({ ...prev, partner: true }));
    try {
      const res = await fetch('/api/delivery-partners', { 
        method: 'POST', 
        body: JSON.stringify(partner), 
        headers: { 'Content-Type': 'application/json' } 
      });
      const data = await res.json();
      if (data.id) {
        setSuccess(prev => ({ ...prev, partner: true }));
        setTimeout(() => setSuccess(prev => ({ ...prev, partner: false })), 3000);
        setPartner({ name:'',email: '', vehicle_type: '', city: '', phone_no: '' });
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    } finally {
      setLoading(prev => ({ ...prev, partner: false }));
    }
  };

  const updateOrderStatus = async (order, newStatus) => {
    try {
      const res = await fetch('/api/ordersadmin', { 
        method: 'PATCH', 
        body: JSON.stringify({ order_id: order.id, status: newStatus }), 
        headers: { 'Content-Type': 'application/json' } 
      });
      const data = await res.json();
      if (data.id) {
        setOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, status: newStatus } : o
        ));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pearl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-navy flex items-center gap-2">
          <span className="bg-navy text-pearl p-2 rounded-lg">
            <Package size={24} />
          </span>
          TailorEase Admin Dashboard
        </h1>
      </header>

      <nav className="mb-8">
        <ul className="flex border-b border-navy/20">
          <li>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'text-navy border-b-2 border-gold' : 'text-navy/70'}`}
            >
              Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('tailors')}
              className={`px-4 py-2 font-medium ${activeTab === 'tailors' ? 'text-navy border-b-2 border-gold' : 'text-navy/70'}`}
            >
              Tailors
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 font-medium ${activeTab === 'partners' ? 'text-navy border-b-2 border-gold' : 'text-navy/70'}`}
            >
              Delivery Partners
            </button>
          </li>
        </ul>
      </nav>

      {activeTab === 'orders' && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-navy mb-6 flex items-center gap-2">
            <Scissors size={20} />
            Order Management
          </h2>
          
          {loading.orders ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy/5 text-navy">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Style</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-pearl/50">
                        <td className="px-4 py-3">#{order.id}</td>
                        <td className="px-4 py-3">{order.full_name}</td>
                        <td className="px-4 py-3">{order.email}</td>
                        <td className="px-4 py-3 capitalize">{order.clothing_style}</td>
                        <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order, 'accepted')}
                            disabled={order.status === 'accepted'}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                              order.status === 'accepted' ? 
                              'bg-green-300 text-white cursor-not-allowed' : 
                              'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            <Check size={16} /> Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order, 'rejected')}
                            disabled={order.status === 'rejected'}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                              order.status === 'rejected' ? 
                              'bg-red-300 text-white cursor-not-allowed' : 
                              'bg-red-500 text-white hover:bg-red-600'
                            }`}
                          >
                            <X size={16} /> Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-navy/70">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === 'tailors' && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-navy mb-6 flex items-center gap-2">
            <Scissors size={20} />
            Add New Tailor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Name</label>
              <input
                type="text"
                value={tailor.name}
                onChange={e => setTailor({ ...tailor, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email ID</label>
              <input
                type="email"
                value={tailor.email}
                onChange={e => setTailor({ ...tailor, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter email ID"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">City</label>
              <input
                type="text"
                value={tailor.city}
                onChange={e => setTailor({ ...tailor, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter city"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Address</label>
              <input
                type="text"
                value={tailor.address}
                onChange={e => setTailor({ ...tailor, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter address"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Phone Number</label>
              <input
                type="tel"
                value={tailor.phone_no}
                onChange={e => setTailor({ ...tailor, phone_no: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter phone number"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Experience (Years)</label>
              <input
                type="number"
                value={tailor.experience_years}
                onChange={e => setTailor({ ...tailor, experience_years: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Years of experience"
                min="0"
                required 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Specializations</label>
              <input
                type="text"
                value={tailor.specializations}
                onChange={e => setTailor({ ...tailor, specializations: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Comma separated skills (e.g., dresses, suits, alterations)"
                required 
              />
              <p className="text-xs text-navy/50 mt-1">Separate multiple specializations with commas</p>
            </div>
          </div>
          
          <button
            onClick={addTailor}
            disabled={loading.tailor}
            className="mt-6 flex items-center gap-2 bg-gold text-navy px-6 py-2 rounded-lg hover:bg-gold/90 disabled:opacity-70"
          >
            {loading.tailor ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy"></div>
                Processing...
              </>
            ) : (
              <>
                <Plus size={18} /> Add Tailor
              </>
            )}
          </button>
          
          {success.tailor && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
              <Check size={18} />
              Tailor added successfully!
            </div>
          )}
        </section>
      )}

      {activeTab === 'partners' && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-navy mb-6 flex items-center gap-2">
            <Truck size={20} />
            Add Delivery Partner
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Name</label>
              <input
                type="text"
                value={partner.name}
                onChange={e => setPartner({ ...partner, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter name"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email ID</label>
              <input
                type="email"
                value={partner.email}
                onChange={e => setPartner({ ...partner, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter email ID"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">City</label>
              <input
                type="text"
                value={partner.city}
                onChange={e => setPartner({ ...partner, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter city"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Phone Number</label>
              <input
                type="tel"
                value={partner.phone_no}
                onChange={e => setPartner({ ...partner, phone_no: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter phone number"
                required 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy mb-1">Vehicle Type</label>
              <select
                value={partner.vehicle_type}
                onChange={e => setPartner({ ...partner, vehicle_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required 
              >
                <option value="">Select vehicle type</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={addPartner}
            disabled={loading.partner}
            className="mt-6 flex items-center gap-2 bg-gold text-navy px-6 py-2 rounded-lg hover:bg-gold/90 disabled:opacity-70"
          >
            {loading.partner ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy"></div>
                Processing...
              </>
            ) : (
              <>
                <Plus size={18} /> Add Partner
              </>
            )}
          </button>
          
          {success.partner && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
              <Check size={18} />
              Delivery partner added successfully!
            </div>
          )}
        </section>
      )}
    </div>
  );
}