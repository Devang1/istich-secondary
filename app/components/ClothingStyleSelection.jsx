'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '../context/OrderContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ClothingStyleSelection = () => {
  const router = useRouter();
  const { updateOrder } = useOrder();

  const [services, setServices] = useState({ Alteration: [], Repair: [] });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();

        if (res.ok) {
          const structured = {
            Alteration: [],
            Repair: []
          };

          data.services.forEach(service => {
            const entry = {
              id: service.id,
              name: service.name,
              image: service.image_url,
              price: service.price,
              description: service.description
            };

            structured[service.category]?.push(entry);
          });

          setServices(structured);
        }
      } catch (err) {
        console.error('Failed to load services', err);
      }
    }

    fetchServices();
  }, []);

  const handleServiceSelection = (service) => {
    updateOrder({
      service: 'Alteration & Repair',
      serviceId: service.id,
      clothingStyle: service.name,
      stitchingPrice: service.price,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
    router.push('/order-summary');
  };

  const renderSection = (title, items) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);

    const filteredItems = items.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-gold mb-10 border-b border-navy/10 pb-2 text-center">{title}</h2>

        {filteredItems.length === 0 ? (
          <p className="text-center text-navy">No services found for "{searchTerm}"</p>
        ) : (
          <div className="relative">
            <div ref={prevRef} className="absolute z-10 -left-5 top-1/2 -translate-y-1/2 hidden sm:flex bg-navy text-white p-2 rounded-full shadow hover:bg-navy-light cursor-pointer">
              <ArrowLeft />
            </div>
            <div ref={nextRef} className="absolute z-10 -right-5 top-1/2 -translate-y-1/2 hidden sm:flex bg-navy text-white p-2 rounded-full shadow hover:bg-navy-light cursor-pointer">
              <ArrowRight />
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              pagination={{
                el: paginationRef.current,
                clickable: true,
              }}
              onSwiper={(swiper) => {
                setTimeout(() => {
                  if (swiper?.navigation?.init) {
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                  if (swiper?.pagination?.init) {
                    swiper.pagination.init();
                    swiper.pagination.update();
                  }
                }, 0);
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {filteredItems.map((service, index) => (
                <SwiperSlide key={service.id}>
                  <div className="px-2">
                    <div
                      className="group cursor-pointer animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleServiceSelection(service)}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                        <div className="relative overflow-hidden h-64">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-sm">{service.description}</p>
                          </div>
                        </div>
                        <div className="p-5 sm:p-6">
                          <h3 className="font-playfair text-2xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors duration-300">
                            {service.name}
                          </h3>
                          <div className="flex justify-between items-center">
                            <span className="text-gold font-bold text-xl">₹{service.price}</span>
                            <button className="bg-navy text-pearl px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-navy-light transition-all duration-300 shadow">
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div ref={paginationRef} className="mt-6 flex justify-center sm:hidden" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-pearl pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-navy mb-4">Choose a Service</h1>
          <p className="text-navy/70 text-lg">Select from our alteration and repair options below</p>
          <input
            type="text"
            placeholder="Search a service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 w-full max-w-md mx-auto border border-navy/20 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        {renderSection('Alteration Services', services.Alteration)}
        {renderSection('Repair Services', services.Repair)}
      </div>
    </div>
  );
};

export default ClothingStyleSelection;
