import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ChevronRight, User, Stethoscope, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

const roleIcons = {
  patient: User,
  doctor: Stethoscope,
  admin: ShieldCheck,
};

const roleColors = {
  patient: 'from-blue-500 to-cyan-400',
  doctor: 'from-emerald-500 to-teal-400',
  admin: 'from-amber-500 to-orange-400',
};

const roleBgColors = {
  patient: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
  doctor: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
  admin: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600',
};

const roleTextColors = {
  patient: 'text-blue-700 dark:text-blue-300',
  doctor: 'text-emerald-700 dark:text-emerald-300',
  admin: 'text-amber-700 dark:text-amber-300',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const loggedRole = login(email, password, role);
      setIsSubmitting(false);
      if (loggedRole) {
        const redirectPath = loggedRole === 'doctor' ? '/dashboard' : loggedRole === 'admin' ? '/admin' : '/patient-dashboard';
        navigate(redirectPath, { replace: true });
      }
    }, 800);
  };

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);
    setIsSubmitting(true);
    setTimeout(() => {
      const loggedRole = login(account.email, account.password, account.role);
      setIsSubmitting(false);
      if (loggedRole) {
        const redirectPath = loggedRole === 'doctor' ? '/dashboard' : loggedRole === 'admin' ? '/admin' : '/patient-dashboard';
        navigate(redirectPath, { replace: true });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-medical-pale/40 to-transparent dark:from-gray-950 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white rounded-3xl shadow-xl border border-gray-100 mb-4">
            <img src="/logo.png" alt="Doctori Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white">Bon retour !</h1>
          <p className="text-gray-500 mt-2">Accédez à votre compte Doctori</p>
        </div>

        {/* Demo Accounts Panel */}
        <AnimatePresence>
          {showDemoPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="glass p-5 rounded-3xl border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold dark:text-white">Comptes Démo</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accès rapide</span>
                </div>
                <div className="space-y-2.5">
                  {DEMO_ACCOUNTS.map((account) => {
                    const Icon = roleIcons[account.role];
                    return (
                      <motion.button
                        key={account.role}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleDemoLogin(account)}
                        disabled={isSubmitting}
                        className={`w-full p-3.5 rounded-2xl border ${roleBgColors[account.role]} flex items-center gap-3 transition-all duration-300 group cursor-pointer disabled:opacity-60`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[account.role]} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-bold ${roleTextColors[account.role]}`}>{account.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{account.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <code className="text-[9px] font-mono bg-white/60 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{account.email}</code>
                          <code className="text-[9px] font-mono bg-white/60 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{account.password}</code>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass p-8 rounded-3xl shadow-xl border border-white/20">
          {/* Role Selector */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'patient' ? 'bg-white dark:bg-gray-700 shadow-sm text-medical-blue font-bold' : 'text-gray-500'}`}
            >
              <User className="w-4 h-4" />
              Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'doctor' ? 'bg-white dark:bg-gray-700 shadow-sm text-medical-blue font-bold' : 'text-gray-500'}`}
            >
              <Stethoscope className="w-4 h-4" />
              Médecin
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${role === 'admin' ? 'bg-white dark:bg-gray-700 shadow-sm text-amber-500 font-bold' : 'text-gray-500'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-medical-blue focus:ring-medical-blue" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-medical-blue font-semibold hover:underline">Oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center !py-4 text-base shadow-lg shadow-medical-blue/25"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Connexion...
                </span>
              ) : (
                <>Se connecter <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-medical-blue font-bold hover:underline">S'inscrire</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
