import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Clock, Phone, Mail, GraduationCap,
  Globe, ChevronLeft, Calendar, CheckCircle, Building, MessageCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { doctors } from '../data/doctors';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startConversation } = useMessages();
  const doctor = doctors.find((d) => d.id === parseInt(id));

  if (!doctor) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Médecin non trouvé</h2>
            <Link to="/doctors" className="btn-primary">Retour à la liste</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleSendMessage = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/doctors/${doctor.id}` } } });
      return;
    }
    startConversation(doctor.id);
    navigate('/messages');
  };

  return (
    <PageTransition>
      {/* Header */}
      <section className="pt-24 pb-0 bg-gradient-to-b from-medical-pale/50 to-transparent dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${doctor.color} flex items-center justify-center text-white font-bold text-3xl shadow-xl flex-shrink-0`}>
                    {doctor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          {doctor.name}
                        </h1>
                        <p className="text-medical-blue dark:text-medical-accent font-semibold text-lg">
                          {doctor.specialty}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-800 dark:text-gray-200">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-medical-blue dark:text-medical-accent" />
                        {doctor.city}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-medical-blue dark:text-medical-accent" />
                        {doctor.experience} ans d'expérience
                      </div>
                      <div className="flex items-center gap-1.5 sm:hidden">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        {doctor.rating} ({doctor.reviews} avis)
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">À propos</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{doctor.description}</p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <GraduationCap className="w-5 h-5 text-medical-blue dark:text-medical-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-0.5">Formation</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{doctor.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <Globe className="w-5 h-5 text-medical-blue dark:text-medical-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-400 mb-0.5">Langues</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{doctor.languages.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Disponibilités</h2>
                
                {/* Cabinet */}
                <div className="mb-8">
                  <h3 className="text-md font-bold text-medical-blue dark:text-medical-accent mb-4 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Au cabinet ({doctor.clinicName})
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(doctor.availabilityCabinet).map(([day, slots]) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-24 flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => (
                            <span
                              key={slot}
                              className="px-3 py-1.5 text-sm rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Domicile */}
                {doctor.availabilityDomicile && (
                  <div>
                    <h3 className="text-md font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Visite à domicile
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(doctor.availabilityDomicile).map(([day, slots]) => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="w-24 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <span
                                key={slot}
                                className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar — shows above content on mobile, right on desktop */}
            <div className="space-y-6 order-first lg:order-none">
              {/* Booking CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card p-6 sticky top-24"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Prendre rendez-vous</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Confirmation immédiate
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Rappel par SMS/Email
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Annulation gratuite
                  </div>
                </div>
                <Link
                  to={`/booking/${doctor.id}`}
                  className="btn-primary w-full justify-center"
                >
                  <Calendar className="w-5 h-5" />
                  Prendre rendez-vous
                </Link>

                {/* Message Button */}
                <button
                  onClick={handleSendMessage}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Envoyer un message
                </button>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="card p-6"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Informations pratiques</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{doctor.clinicName}</p>
                      <p className="text-xs text-gray-400">{doctor.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{doctor.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{doctor.email}</p>
                  </div>
                </div>
              </motion.div>

              {/* Reviews Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Avis patients</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-bold text-gradient">{doctor.rating}</div>
                  <div>
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(doctor.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">{doctor.reviews} avis</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stars === 5 ? 72 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 2 : 1;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-3">{stars}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
