'use client';
import { useState } from 'react';
import { MapPin, Phone, Star, Truck, PackageCheck, Scissors, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

const ordersList = [
  {
    id: 'ORD123456',
    product: 'Custom Kurta Pajama',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiYW1qMjYQegW4suqnwfSBY7jE3Ig36yuf_Q&s',
    placedAt: '15 June 2025',
    estimatedDelivery: '20 June 2025',
    status: 'Picked Up by Delivery Partner',
    timeline: [
      { step: 'Order Placed', completed: true, date: '15 June' },
      { step: 'Tailor Started Working', completed: true, date: '16 June' },
      { step: 'Tailor Finished Working', completed: true, date: '18 June' },
      { step: 'Picked Up by Delivery Partner', completed: true, date: '19 June' },
      { step: 'Out for Delivery', completed: false },
      { step: 'Delivered', completed: false },
    ],
    tailor: {
      name: 'Ravi Mehta',
      city: 'Mumbai',
      phone: '9876543210',
      rating: 4.8,
    },
  },
  {
    id: 'ORD654321',
    product: 'Custom Sherwani',
    image: 'https://source.unsplash.com/200x200/?sherwani',
    placedAt: '12 June 2025',
    estimatedDelivery: '18 June 2025',
    status: 'Tailor Started Working',
    timeline: [
      { step: 'Order Placed', completed: true, date: '12 June' },
      { step: 'Tailor Started Working', completed: true, date: '13 June' },
      { step: 'Tailor Finished Working', completed: false },
      { step: 'Picked Up by Delivery Partner', completed: false },
      { step: 'Out for Delivery', completed: false },
      { step: 'Delivered', completed: false },
    ],
    tailor: {
      name: 'Amit Tailors',
      city: 'Delhi',
      phone: '9876543211',
      rating: 4.5,
    },
  },
  {
    id: 'ORD789123',
    product: 'Custom Blazer',
    image: 'https://source.unsplash.com/200x200/?blazer',
    placedAt: '10 June 2025',
    estimatedDelivery: '16 June 2025',
    status: 'Tailor Finished Working',
    timeline: [
      { step: 'Order Placed', completed: true, date: '10 June' },
      { step: 'Tailor Started Working', completed: true, date: '11 June' },
      { step: 'Tailor Finished Working', completed: true, date: '14 June' },
      { step: 'Picked Up by Delivery Partner', completed: false },
      { step: 'Out for Delivery', completed: false },
      { step: 'Delivered', completed: false },
    ],
    tailor: {
      name: 'Zaid Designs',
      city: 'Lucknow',
      phone: '9876543222',
      rating: 4.6,
    },
  },
  {
    id: 'ORD321789',
    product: 'Custom Jacket',
    image: 'https://source.unsplash.com/200x200/?jacket',
    placedAt: '09 June 2025',
    estimatedDelivery: '15 June 2025',
    status: 'Delivered',
    timeline: [
      { step: 'Order Placed', completed: true, date: '09 June' },
      { step: 'Tailor Started Working', completed: true, date: '10 June' },
      { step: 'Tailor Finished Working', completed: true, date: '12 June' },
      { step: 'Picked Up by Delivery Partner', completed: true, date: '13 June' },
      { step: 'Out for Delivery', completed: true, date: '14 June' },
      { step: 'Delivered', completed: true, date: '15 June' },
    ],
    tailor: {
      name: 'R.K. Tailors',
      city: 'Pune',
      phone: '9876543233',
      rating: 4.9,
    },
  },
];

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="min-h-screen bg-pearl px-4 py-10">
      <div className="max-w-6xl mx-auto">
          
        <h2 className="text-3xl font-bold text-navy mb-6">Your Orders</h2>

        {!selectedOrder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordersList.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer bg-[#FDFCF7] p-4 rounded-xl shadow-md hover:shadow-xl transition-all border-b-gold-light bord"
              >
                {console.log(order)}
                <div className="relative h-40 w-full bg-pearl p-1 rounded-md border mb-4">
                  <Image
                    src={order.image}
                    alt={order.product}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-lg font-semibold text-navy">{order.product}</p>
                <p className="text-sm text-navy">Order ID: #{order.id}</p>
                <p className="text-sm text-navy">Placed: {order.placedAt}</p>
                <p className="text-sm text-navy mt-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {order.tailor.phone}
                </p>
                <p className="text-sm text-navy">👔 {order.tailor.name}</p>
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-navy">Order Details</h3>
              <button
                className="text-md text-gold"
                onClick={() => setSelectedOrder(null)}
              >
                ← Back to all orders
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              
              <div className="relative w-40 h-40">
                <Image
                  src={selectedOrder.image}
                  alt={selectedOrder.product}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold text-navy">{selectedOrder.product}</p>
                <p className="text-sm text-gray-500">Order ID: #{selectedOrder.id}</p>
                <p className="text-sm text-gray-500">Placed: {selectedOrder.placedAt}</p>
                <p className="text-sm text-gray-500">
                  Estimated Delivery: {selectedOrder.estimatedDelivery}
                </p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full mt-2">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-8">
              <h3 className="font-semibold text-navy text-lg mb-4">Order Progress</h3>
              <div className="flex flex-col gap-4">
                {selectedOrder.timeline.map((event, index) => {
                  const getIcon = (step) => {
                    switch (step) {
                      case 'Order Placed':
                        return <PackageCheck className="w-5 h-5 text-gold" />;
                      case 'Tailor Started Working':
                        return <Scissors className="w-5 h-5 text-gold" />;
                      case 'Tailor Finished Working':
                        return <ShieldCheck className="w-5 h-5 text-gold" />;
                      case 'Picked Up by Delivery Partner':
                        return <Truck className="w-5 h-5 text-gold" />;
                      case 'Out for Delivery':
                        return <Truck className="w-5 h-5 text-gold animate-pulse" />;
                      case 'Delivered':
                        return <CheckCircle className="w-5 h-5 text-green-600" />;
                      default:
                        return <Clock className="w-5 h-5 text-gray-400" />;
                    }
                  };

                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1">
                        {getIcon(event.step)}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            event.completed ? 'text-navy' : 'text-navy/40'
                          }`}
                        >
                          {event.step}
                          {event.date && (
                            <span className="ml-2 text-navy/60 font-normal">
                              ({event.date})
                            </span>
                          )}
                        </p>
                        {event.completed && (
                          <div className="h-[2px] bg-gold mt-2 w-40 md:w-72 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tailor Info */}
            <div className="mt-8 bg-gold/10 p-4 rounded-lg">
              <h4 className="font-semibold text-navy text-lg mb-3">Tailor Details</h4>
              <div className="flex gap-4 items-start">
                <div className="bg-gold/20 p-2 rounded-full">
                  <Star className="text-gold h-6 w-6" />
                </div>
                <div>
                  <p className="text-navy font-medium">{selectedOrder.tailor.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {selectedOrder.tailor.city}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-1" /> {selectedOrder.tailor.phone}
                  </p>
                  <p className="text-sm text-gray-600">⭐ {selectedOrder.tailor.rating} Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;