import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, MessageSquare, MapPin, Phone, Clock,
  Send, CheckCircle, AlertCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Toast from '../components/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    else if (formData.message.trim().length < 10) newErrors.message = 'Le message doit contenir au moins 10 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ email: '', message: '' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <PageTransition>
      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-medical-pale/50 to-transparent dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="badge mb-4">Contactez-nous</span>
            <h1 className="section-title mb-4">
              Une question ?{' '}
              <span className="text-gradient">Écrivez-nous</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Notre équipe est à votre disposition pour répondre à toutes vos questions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                  Informations de contact
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      icon: MapPin,
                      label: 'Adresse',
                      value: ' sig\nMascara, 29000',
                      color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
                    },
                    {
                      icon: Mail,
                      label: 'Email',
                      value: 'contact@doctori.dz',
                      color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
                    },
                    {
                      icon: Phone,
                      label: 'Téléphone',
                      value: '+213 21 00 00 00',
                      color: 'text-violet-500 bg-violet-100 dark:bg-violet-900/30',
                    },
                    {
                      icon: Clock,
                      label: 'Horaires',
                      value: 'Dim - Jeu: 08:00 - 17:00',
                      color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
                    },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-medical-pale to-blue-100 dark:from-gray-800 dark:to-gray-700 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-medical-blue dark:text-medical-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-medical-blue dark:text-medical-accent">
                      Alger Centre, Algérie
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-medical-blue/10 dark:bg-medical-blue/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-medical-blue dark:text-medical-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nous répondrons dans les plus brefs délais
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4" />
                      Votre adresse email
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: votre@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`input-field ${errors.email ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Votre message
                    </label>
                    <textarea
                      placeholder="Décrivez votre demande ici..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={6}
                      className={`input-field resize-none ${errors.message ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center text-base !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Votre message a été envoyé avec succès. Nous reviendrons vers vous rapidement !"
      />
    </PageTransition>
  );
}
