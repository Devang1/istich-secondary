'use client';

import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      detail: '+91 98765 43210',
      description: 'Mon-Sat 9AM-8PM',
    },
    {
      icon: Mail,
      title: 'Email',
      detail: 'hello@tailorelite.com',
      description: "We'll respond within 24 hours",
    },
    {
      icon: MapPin,
      title: 'Office',
      detail: 'Mumbai, Delhi, Bangalore',
      description: 'Home visits available',
    },
  ];

  return (
    <div className="min-h-screen bg-pearl py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-navy mb-6">
            Get In Touch
          </h1>
          <p className="text-navy/70 text-lg lg:text-xl max-w-3xl mx-auto">
            Have questions about our services? Want to schedule a consultation? 
            We're here to help you create the perfect wardrobe.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-navy mb-2">
                  {method.title}
                </h3>
                <p className="text-navy font-semibold mb-2">{method.detail}</p>
                <p className="text-navy/70">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-playfair text-3xl font-semibold text-navy mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Service Interest</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                  <option>Select a service</option>
                  <option>Custom Tailoring</option>
                  <option>At-Home Measurements</option>
                  <option>Alterations & Repairs</option>
                  <option>Fabric Consultation</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-navy px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transform hover:scale-105 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-playfair text-3xl font-semibold text-navy mb-6">
                Visit Our Showroom
              </h2>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <p className="font-semibold text-navy">Mumbai Showroom</p>
                    <p className="text-navy/70">123 Fashion Street, Bandra West, Mumbai - 400050</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <p className="font-semibold text-navy">Business Hours</p>
                    <p className="text-navy/70">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p className="text-navy/70">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl shadow-lg p-8 text-center">
              <MessageCircle className="h-16 w-16 text-gold mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-semibold text-pearl mb-4">
                WhatsApp Support
              </h3>
              <p className="text-pearl/80 mb-6">
                Get instant support and quick answers to your questions
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300">
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
