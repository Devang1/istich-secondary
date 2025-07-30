"use client";

import { useEffect, useState } from "react";

const ActiveDeliveryMap = ({ order, onDelivered, onReport }) => {
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapsOpened, setMapsOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch destination coordinates using OpenStreetMap Nominatim
  useEffect(() => {
    if (!order?.address) return;

    const fetchLatLng = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            order.address
          )}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setDestination({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setErrorMsg("No location found for the given address.");
        }
      } catch (err) {
        setErrorMsg("Error fetching destination coordinates.");
      }
    };

    fetchLatLng();
  }, [order]);

  // Get current user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setErrorMsg("Unable to fetch your current location.");
        }
      );
    } else {
      setErrorMsg("Geolocation is not supported.");
    }
  }, []);

  // Open Google Maps in new tab when both locations are available
  useEffect(() => {
    if (currentLocation && destination && !mapsOpened) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${destination.lat},${destination.lng}`;
      window.open(url, "_blank");
      setMapsOpened(true);
      setLoading(false);
    }
  }, [currentLocation, destination, mapsOpened]);

  const handleDelivery = () => {
    if (onDelivered) onDelivered(order);
  };

  const handleReport = () => {
    const reason = prompt("Please enter reason (e.g., 'Receiver not available'):");
    if (reason && onReport) {
      onReport(order, reason);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pearl px-4 py-10 text-navy text-center">
      <h1 className="text-2xl font-semibold mb-4">Live Delivery Tracker</h1>

      {loading ? (
        <p className="text-lg">Fetching route to <strong>{order?.customer}</strong>'s address...</p>
      ) : errorMsg ? (
        <p className="text-red-600 font-medium">{errorMsg}</p>
      ) : (
        <>
          <p className="mb-6 text-lg">
            Route to <strong>{order.customer}</strong> was opened in Google Maps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDelivery}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Mark as Delivered
            </button>

            <button
              onClick={handleReport}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Report Issue
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveDeliveryMap;
