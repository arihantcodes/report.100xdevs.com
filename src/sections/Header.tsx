"use client";

import React, { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import Button from "@/components/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 border-b border-white/15 md:border-none sticky top-0 z-10">
      <div className="container">
        <div className="flex justify-between md:border items-center rounded-xl border-white/15 md:p-2.5 max-w-2xl mx-auto">
          <div>
            <h1>100xDevs</h1>
          </div>

          <div className="hidden md:block">
            <nav className="flex gap-8 text-sm ">
              <Link
                className="text-white/70 hover:text-white transition"
                href="https://100xdevs.com/#course"
              >
                Course
              </Link>
              <Link
                className="text-white/70 hover:text-white transition"
                href="https://100xdevs.com/#testimonial"
              >
                Testimonials
              </Link>
              <Link
                className="text-white/70 hover:text-white transition"
                href="https://100xdevs.com/#faq"
              >
                FAQs
              </Link>
            </nav>
          </div>

          <div className="flex gap-4 items-center">
          <Link href="https://harkirat.classx.co.in/new-courses/14-complete-web-development-devops-blockchain-cohort">
          <Button>Buy Cohort</Button>
          </Link>
            <button
              onClick={toggleMenu}
              className="md:hidden focus:outline-none relative"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <MenuIcon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 transition-transform duration-300 transform translate-y-0">
          <nav className="flex flex-col gap-4 text-sm">
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://100xdevs.com/#course"
            >
              Course
            </Link>
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://100xdevs.com/#testimonial"
            >
              Testimonials
            </Link>
            <Link
              className="text-white/70 hover:text-white transition"
              href="https://100xdevs.com/#faq"
            >
              FAQs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
