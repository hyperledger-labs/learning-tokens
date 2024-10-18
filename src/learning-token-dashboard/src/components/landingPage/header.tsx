import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import Login from "@/pages/Login";
import { Button } from "../ui/button";
import Register from "@/pages/Register";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ContactUs from "@/pages/contactUs";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user.email) {
      setIsLogin(true);
      setIsDialogOpen(true);
    }
  }, [user]);

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className={`text-2xl font-bold ${
            isScrolled ? "text-[#013A44]" : "text-black"
          }`}
        >
          Learning Tokens
        </div>
        <ul className="flex space-x-6">
          <li>
            <a
              href="#features"
              className={`hover:text-[#013A44] ${
                isScrolled ? "text-gray-600" : "text-black"
              }`}
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={`hover:text-[#013A44] ${
                isScrolled ? "text-gray-600" : "text-black"
              }`}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className={`hover:text-[#013A44] ${
                isScrolled ? "text-gray-600" : "text-black"
              }`}
            >
              How It Works
            </a>
          </li>
          <li>
            <a
              href="#testimonials"
              className={`hover:text-[#013A44] ${
                isScrolled ? "text-gray-600" : "text-black"
              }`}
            >
              Testimonials
            </a>
          </li>
          <Dialog>
            <DialogTrigger>
              <li>
                <a
                  href="#contact"
                  className={`hover:text-[#013A44] ${
                    isScrolled ? "text-gray-600" : "text-white"
                  }`}
                >
                  Contact Us
                </a>
              </li>
            </DialogTrigger>
            <DialogContent className="bg-gray-100">
              <ContactUs />
            </DialogContent>
          </Dialog>
        </ul>
        <div className="flex space-x-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`pr-0 pl-4 py-2 rounded-full ${
                  isScrolled
                    ? "bg-[#013A44] text-white"
                    : "bg-white text-[#013A44]"
                } hover:bg-blue-700 hover:text-white transition-colors`}
                onClick={() => setIsDialogOpen(true)}
              >
                Sign In
                <span
                  className={`pr-4 py-2 rounded-tr-full rounded-br-full ${
                    isScrolled
                      ? "bg-white text-[#013A44] border border-[#013A44]"
                      : "bg-[#013A44] text-white"
                  } hover:bg-blue-700 hover:text-white transition-colors`}
                >
                  Up
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              {isLogin ? <Login /> : <Register />}
              <DialogFooter className="mx-auto">
                {isLogin ? "Not " : "Already "} registered?
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  className={`text-primary ml-2 cursor-pointer hover:underline hover:text-primary/90 hover:decoration-primary/90 hover:decoration-2`}
                >
                  {" "}
                  {isLogin ? "Register" : "Login"}
                </span>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
