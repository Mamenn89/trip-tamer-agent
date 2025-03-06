
import React from 'react';
import { MapPin, Mail, Globe, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 text-black font-medium mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xl font-semibold">TravelMate</span>
            </div>
            <p className="text-gray-500 text-sm">
              Your AI-powered travel companion. Plan your perfect trip with personalized recommendations and itineraries.
            </p>
            <div className="flex space-x-4 mt-6">
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" label="Twitter" />
              <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" label="Instagram" />
              <SocialLink icon={<Github className="w-5 h-5" />} href="#" label="GitHub" />
              <SocialLink icon={<Globe className="w-5 h-5" />} href="#" label="Website" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/planner" label="Plan a Trip" />
              <FooterLink href="/inspiration" label="Travel Inspiration" />
              <FooterLink href="/about" label="About Us" />
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <FooterLink href="#" label="Travel Guides" />
              <FooterLink href="#" label="City Guides" />
              <FooterLink href="#" label="Travel Tips" />
              <FooterLink href="#" label="FAQ" />
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>hello@travelmate.ai</span>
              </li>
              <li className="mt-4">
                <button 
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} TravelMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href, label }) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-gray-500 transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, label }) => (
  <li>
    <Link 
      to={href} 
      className="text-gray-600 hover:text-blue-500 transition-colors"
    >
      {label}
    </Link>
  </li>
);

export default Footer;
