import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Plus, ChevronRight, User, Stethoscope, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'patient'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (formData.role === 'doctor' ? '/dashboard' : '/patient-dashboard');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      register(formData);
      setIsSubmitting(false);
      navigate(from, { replace: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-medical-blue/5 to-transparent dark:from-gray-950 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Créer un compte</h1>
          <p className="text-gray-500 mt-2">Rejoignez la communauté Doctori</p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-xl border border-white/20">
          {/* Role Selector */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8">
            <button
              onClick={() => setFormData(p => ({...p, role: 'patient'}))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${formData.role === 'patient' ? 'bg-white dark:bg-gray-700 shadow-sm text-medical-blue font-bold' : 'text-gray-500'}`}
            >
              <User className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => setFormData(p => ({...p, role: 'doctor'}))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${formData.role === 'doctor' ? 'bg-white dark:bg-gray-700 shadow-sm text-medical-blue font-bold' : 'text-gray-500'}`}
            >
              <Stethoscope className="w-4 h-4" />
              Médecin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Mohamed Benali"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 00 00 00 00"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center !py-4 text-base shadow-lg shadow-medical-blue/25 mt-4"
            >
              {isSubmitting ? "Création..." : "Créer mon compte"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-medical-blue font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
