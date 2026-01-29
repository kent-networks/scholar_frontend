"use client";

import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "For Students", href: "/for-students" },
    { name: "For Educators", href: "/for-educators" },
    { name: "Community", href: "/community" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#101828] text-white">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" strokeWidth={1.5}/>
              <span className="text-xl font-bold">Bwati</span>
            </Link>
            <p className="max-w-md mb-4 text-slate-400">
              Your academic ecosystem for research, collaboration, and community engagement.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" strokeWidth={1.5}/>
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="p-2 transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5}/>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-bold">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-slate-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-bold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-slate-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          {/* <div>
            <h3 className="mb-4 font-bold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors text-slate-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="pt-8 mt-8 text-center border-t border-white/10 text-slate-400">
          <p>&copy; {new Date().getFullYear()} Bwati. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

