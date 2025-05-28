

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.jpeg';

const Footer = () => {
  return (
    <footer className="w-full bg-[#20497F] text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src={logo} 
                alt="Murakoze Logo" 
                className="h-12 mr-3 bg-white rounded-full p-1"
              />
              <span className="text-2xl font-bold">MURAKOZE™</span>
            </div>
            <p className="text-sm">Copyright ©2025 Murakoze</p>
            <p className="text-sm flex items-center mt-2">
              Built with <span className="text-red-500 mx-1">❤</span> by Wiredin
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                  LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                  Twitter <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="mailto:info@wiredin.rw" className="hover:underline">
                  info@wiredin.rw
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

