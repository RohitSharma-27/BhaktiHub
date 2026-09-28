import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Explore: [
    { label: 'Singers', path: '/singers' },
    { label: 'Musicians', path: '/musicians' },
    { label: 'Sound Providers', path: '/sound-providers' },
    { label: 'Contact', path: '/contact' },
  ],
  Company: [
    { label: 'About Us', path: '/' },
    { label: 'Contact Us', path: '/contact' },
  ],
  Support: [
    { label: 'Help Center', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-20">
     <div className="container-page py-10 lg:py-14">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 lg:gap-10">

          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-saffron-gradient flex items-center justify-center">
                <span className="font-display text-white text-xl font-bold">B</span>
              </div>

              <span className="font-display text-xl font-bold text-white">
                SankirtanHub
              </span>
            </Link>

           <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mb-4 lg:mb-6">
              India's premier devotional artist booking platform. Connect with
              Bhajan Singers, Kirtan Mandalis, Musical Groups, Sound Providers,
              and other devotional services for your spiritual events.
            </p>

            <div className="space-y-2 text-sm">

              <a
                href="mailto:SankirtanHub.bookings@gmail.com"
                className="flex items-center gap-2 text-neutral-400 hover:text-saffron-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                SankirtanHub.bookings@gmail.com
              </a>

              <p className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-4 h-4" />
                Rajasthan, India
              </p>

            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-white font-semibold mb-4">
                {title}
              </h4>

              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-neutral-400 hover:text-saffron-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

       <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-neutral-800  flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} SankirtanHub. All rights reserved. Made
            with devotion in India.
          </p>
        </div>
      </div>
    </footer>
  );
}