import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Doctori Logo" className="h-14 w-auto object-contain drop-shadow-sm" />
              <span className="text-2xl font-black tracking-tight text-white">
                Doctori
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              La première plateforme algérienne de prise de rendez-vous médicaux en ligne focalisée sur Sig, Mascara et Oran. 
              Simple, rapide et accessible.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-medical-blue flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: 'Accueil', path: '/' },
                { name: 'Médecins', path: '/doctors' },
                { name: 'À propos', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-medical-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-white font-semibold mb-4">Spécialités</h3>
            <ul className="space-y-3">
              {['Cardiologie', 'Chirurgie Vasculaire', 'Ophtalmologie', 'Orthopédie', 'Dentisterie', 'Médecine Générale'].map((s) => (
                <li key={s}>
                  <Link
                    to="/doctors"
                    className="text-sm text-gray-400 hover:text-medical-accent transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-medical-accent flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Rue Principale,<br />Sig, Mascara, Algérie
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-medical-accent flex-shrink-0" />
                <span className="text-sm text-gray-400">+213 795 73 74 16</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-medical-accent flex-shrink-0" />
                <span className="text-sm text-gray-400">contact@doctori.dz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Doctori — Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
