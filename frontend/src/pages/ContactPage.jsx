import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground mb-10">
            Have questions about our mushroom identification service? Here's how you can reach us!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-mushroom-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground">contact@fungalizerAI.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-mushroom-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-muted-foreground">(+94) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday, 9am - 5pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-mushroom-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Address</h3>
                    <p className="text-muted-foreground">
                      123 Main St.<br />
                      Colombo, 00100<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="bg-background border rounded-lg p-6 shadow-sm">
                <h1 className="text-xl font-semibold mb-4">Send us a message</h1>
                <p className="text-muted-foreground mb-4">
                  You can reach out to us via email at 
                  <a href="mailto:contact@fungalizerAI.com" className="text-mushroom-primary ml-1 hover:underline">
                    contact@fungalizerAI.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;