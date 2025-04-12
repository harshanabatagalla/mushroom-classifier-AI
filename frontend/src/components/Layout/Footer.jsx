
import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-mushroom-primary" />
            <span className="text-lg font-bold">Mushroom SafeGuard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Safe mushroom identification using AI. <br />
            Always confirm with expert advice before consumption.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Link to="/about" className="text-sm hover:underline">
            About
          </Link>
          <Link to="/contact" className="text-sm hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="text-sm hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mushroom SafeGuard. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
