import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import ContactUs from "@/pages/contactUs";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">Learning Tokens</h3>
            <p className="text-sm">Empowering education through blockchain</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400">
              Terms of Service
            </a>
            <Dialog>
              <DialogTrigger>
                <a href="#" className="hover:text-blue-400">
                  Contact Us
                </a>
              </DialogTrigger>
              <DialogContent className="bg-gray-100">
                <ContactUs />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Learning Tokens. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
