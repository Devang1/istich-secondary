'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, Package, CreditCard, Check
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useappstore } from '../store';

const OrderSummary = () => {
  const router = useRouter();
  const { order, resetOrder } = useOrder();
  const {userinfo,setuserinfo}=useappstore();

  const [instructionText, setInstructionText] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.display_name || '';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return '';
    }
  };

  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocationError(null);
    setIsFetchingLocation(true);
    try {
      if (!navigator.geolocation) throw new Error('Geolocation not supported');
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000, maximumAge: 60000, enableHighAccuracy: true
        });
      });
      const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserCoords(coords);
      const fetchedAddress = await reverseGeocode(coords.lat, coords.lng);
      setAddress(fetchedAddress);
    } catch (err) {
      console.error(err);
      setLocationError('Unable to fetch current location. Please enable location services.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  useEffect(() => {
    if (!order.clothingStyle) router.push('/');
  }, [order, router]);

  const stitchingCost = Number(order.stitchingPrice || 0);
  const deliveryCharge = 50;
  const totalCost = Number((stitchingCost + deliveryCharge).toFixed(2));

  const handleConfirmOrder = async () => {
    try {
      if (!address) {
        toast.error('Please enter a delivery address.');
        return;
      }

      const coords = await geocodeAddress(address);
      if (!coords) {
        toast.error('Invalid address. Please try again.');
        return;
      }

      const fullAddress = await reverseGeocode(coords.lat, coords.lng);
      if (!fullAddress.toLowerCase().includes('delhi')) {
        toast.error('Sorry, service is not yet available in your area.');
        return;
      }

      const payload = {
        user_id: userinfo.id,
        tailor_id: null,
        delivery_partner_id: null,
        service_id: order.serviceId,
        address: fullAddress,
        status: 'placed',
        placed_at: new Date().toISOString(),
        estimated_delivery: deliveryDateTime || order.deliveryDate,
        stitching_price: stitchingCost,
        delivery_price: deliveryCharge,
        total_price: totalCost,
        full_name: fullName,
        phone_number: phoneNumber,
        instructions: instructionText,
        clothing_style: order.clothingStyle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Order submission failed');

      toast.success('Order placed successfully!');
      resetOrder();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-pearl py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center text-navy hover:text-gold mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back
          </button>
          <h1 className="font-playfair text-4xl font-bold text-navy mb-4">Order Summary</h1>
          <p className="text-navy/70 text-lg">Review your order details before confirming</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-playfair text-2xl font-semibold text-navy mb-6">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Delivery Date & Time</label>
                  <input
                    type="datetime-local"
                    value={deliveryDateTime}
                    onChange={(e) => setDeliveryDateTime(e.target.value)}
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                    placeholder="Type your delivery address or use current location"
                  />
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isFetchingLocation}
                    className="mt-2 px-4 py-2 bg-navy text-white rounded-lg"
                  >
                    {isFetchingLocation ? 'Locating...' : 'Use Current Location'}
                  </button>
                  {locationError && <p className="text-red-600 mt-2">{locationError}</p>}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-playfair text-2xl font-semibold text-navy mb-6">Instructions for Tailor</h2>
              <textarea
                rows={4}
                value={instructionText}
                onChange={e => setInstructionText(e.target.value)}
                className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold"
                placeholder="Write any special instructions for the tailor..."
              />
            </div>
          </div>

          {/* Order Details + Price breakdown */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-playfair text-2xl font-semibold text-navy mb-6">Order Details</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Package className="h-6 w-6 text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy">Service</h3>
                    <p className="text-navy/70">{order.service}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Check className="h-6 w-6 text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy">Clothing Style</h3>
                    <p className="text-navy/70">{order.clothingStyle}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Calendar className="h-6 w-6 text-gold mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy">Estimated Delivery</h3>
                    <p className="text-navy/70">
                      {deliveryDateTime
                        ? new Date(deliveryDateTime).toLocaleString()
                        : order.deliveryDate
                          ? new Date(order.deliveryDate).toLocaleString()
                          : 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="font-playfair text-2xl font-semibold text-navy mb-6">Price Breakdown</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-navy/70">Stitching Cost</span>
                  <span className="font-semibold text-navy">₹{stitchingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/70">Delivery Charge</span>
                  <span className="font-semibold text-navy">₹{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-navy">Total</span>
                    <span className="text-2xl font-bold text-gold">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleConfirmOrder} className="w-full bg-gold text-navy px-6 py-4 rounded-lg font-semibold flex items-center justify-center">
                <CreditCard className="mr-2 h-5 w-5" /> Confirm Order
              </button>
              <p className="text-sm text-navy/60 text-center mt-4">You will receive a confirmation email once your order is placed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
