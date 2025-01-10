import React from 'react';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img
                src="/api/placeholder/150/50"
                alt="Brand Logo"
                className="w-auto h-8"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              We're dedicated to providing exceptional service and value to our customers.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-gray-900 hover:bg-gray-100">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-gray-900 hover:bg-gray-100">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-gray-900 hover:bg-gray-100">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-gray-900 hover:bg-gray-100">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-gray-600 transition-colors duration-200 rounded-full hover:text-gray-900 hover:bg-gray-100">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'How We Work', 'Services', 'About', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-600" />
                <p className="text-sm leading-relaxed text-gray-600">
                  WP86+9P3, Vaishali Marg,<br />
                  Panchyawala, Jaipur,<br />
                  Rajasthan 302034
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <a href="mailto:buy1gram@gmail.com" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                  buy1gram@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <a href="tel:+918619641968" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                  +91 8619641968
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Location</h4>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.225086531864!2d75.7438897150103!3d26.92207078311896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db537e8309353%3A0x6d0b5bbf11bc5471!2sRajasthan%20Centre%20of%20Advanced%20Research!5e0!3m2!1sen!2sin!4v1619016556302!5m2!1sen!2sin"
                className="w-full h-48"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-12 border-t border-gray-200">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} BuyOneGram. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;