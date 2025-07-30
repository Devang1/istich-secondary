"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scissors, Star, Users, Home, Palette, Settings, Truck,
  ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import Image from 'next/image';

import ClothingStyleSelection from "./components/ClothingStyleSelection"; 

import './globals.css';

const HomePage = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Corporate Executive",
      content: "TailorElite transformed my professional wardrobe. The attention to detail and perfect fit exceeded all my expectations.",
      rating: 5,
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Wedding Client",
      content: "My wedding suit was absolutely perfect. The doorstep service made the entire process stress-free and convenient.",
      rating: 5,
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Emma Davis",
      role: "Fashion Enthusiast",
      content: "The quality of craftsmanship is unmatched. Every piece feels like it was made exclusively for me.",
      rating: 5,
      image: "https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="hero1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/60 to-navy/80 z-10" />

        <div className="relative z-20 text-center max-w-4xl w-full">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-pearl leading-tight mb-8 tracking-wide">
            CUSTOM-FIT
            <span className="block text-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 tracking-widest drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]">
              TAILORING
            </span>
            <span className="text-lg sm:text-xl lg:text-2xl font-inter font-light tracking-widest text-pearl/70 block mt-4">
              AT YOUR DOORSTEP
            </span>
          </h1>

          <div className="flex justify-center mt-6">
            <Link
              href="/AlterationSelection"
              className="w-full sm:w-auto text-center bg-transparent border border-gold text-gold px-6 py-3 sm:px-10 sm:py-4 rounded-full font-medium tracking-wide text-sm sm:text-base md:text-lg hover:bg-gold hover:text-navy transition-all duration-300 shadow-sm"
            >
              Need an Alteration?
            </Link>
          </div>
        </div>
      </section>

      <ClothingStyleSelection /> 

      <section className="py-20 bg-pearl-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Discover why thousands trust TailorElite for their custom tailoring needs.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-6 border-4 border-gold-500"
                />

                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <blockquote className="text-xl lg:text-2xl text-gray-700 mb-6 italic font-medium leading-relaxed">
                  {testimonials[currentTestimonial].content}
                </blockquote>
                <div>
                  <h4 className="font-playfair text-xl font-bold text-navy-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-navy-900" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-navy-900" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-gold-500 scale-125'
                      : 'bg-gray-300 hover:bg-gold-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-navy to-navy-light">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-pearl mb-6">
            Ready to Experience Luxury Tailoring?
          </h2>
          <p className="text-pearl/80 text-lg lg:text-xl mb-8">
            Join thousands of satisfied customers who trust iStitch for their custom clothing needs.
          </p>
          <Link
            href="/clothing-style"
            className="inline-block bg-gold text-navy px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
