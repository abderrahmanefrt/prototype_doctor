import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Calendar, ShieldCheck, Clock,
  MapPin, ChevronRight, Star, Heart,
  Zap, Award, Users, CheckCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { doctors } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';

export default function Home() {
  const featuredDoctors = doctors.slice(0, 3);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-medical-blue/10 dark:bg-medical-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-medical-light/10 dark:bg-medical-blue/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-blue/10 dark:bg-medical-accent/10 text-medical-blue dark:text-medical-accent font-semibold text-sm mb-8"
            >

            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-[1.1] tracking-tight"
            >
              Prenez soin de votre santé{' '}
              <span className="text-gradient">simplement et rapidement.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Trouvez les meilleurs médecins spécialistes à travers toute l'Algérie et réservez
              votre consultation en quelques clics, à tout moment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
            >
              <Link to="/doctors" className="btn-primary w-full sm:w-auto text-lg !py-4 !px-8 flex items-center justify-center gap-2 group">
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Trouver un médecin
              </Link>
              <Link to="/login" className="btn-secondary w-full sm:w-auto text-lg !py-4 !px-8 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Se connecter
              </Link>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24"
            >
              {[
                { label: 'Médecins vérifiés', value: '500+' },
                { label: 'Rendez-vous pris', value: '150k+' },
                { label: 'Villes couvertes', value: '48' },
                { label: 'Avis positifs', value: '98%' },
              ].map((stat, i) => (
                <div key={i} className="card p-4 sm:p-6 bg-white/50 backdrop-blur-sm border-white/20 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "100% Sécurisé",
                desc: "Vos données de santé sont protégées et cryptées selon les normes européennes."
              },
              {
                icon: Award,
                title: "Médecins Certifiés",
                desc: "Chaque professionnel sur notre plateforme est vérifié manuellement par notre équipe."
              },
              {
                icon: Zap,
                title: "Instantané",
                desc: "Réservez votre créneau en moins de 2 minutes, 24h/24 et 7j/7 sans attente au téléphone."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-xl flex items-center justify-center mb-6 text-medical-blue dark:text-medical-accent group-hover:scale-110 group-hover:bg-medical-blue group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Steps Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Comment ça marche ? <br />
                <span className="text-medical-blue">C'est simple comme bonjour.</span>
              </h2>

              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Recherchez un médecin",
                    desc: "Filtrez par spécialité, ville ou nom pour trouver le praticien idéal."
                  },
                  {
                    step: "02",
                    title: "Choisissez votre créneau",
                    desc: "Consultez les disponibilités réelles et choisissez le moment qui vous convient."
                  },
                  {
                    step: "03",
                    title: "Réservez et confirmez",
                    desc: "Recevez une confirmation immédiate et un rappel par email."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-4xl font-black text-gray-100 dark:text-gray-800 transition-colors group-hover:text-medical-blue/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-medical-blue to-medical-light p-1 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[22px] p-8 flex flex-col justify-center gap-6">
                  {/* Floating App Card Simulation */}
                  <div className="card p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Confirmation</p>
                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">RDV Confirmé pour demain à 10h</p>
                      </div>
                    </div>
                  </div>
                  <div className="card p-4 animate-float delay-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Santé</p>
                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">Suivi cardiaque Dr. Benali</p>
                      </div>
                    </div>
                  </div>
                  <div className="card p-4 animate-float delay-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Avis</p>
                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">4.9/5 satisfaction patient</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Médecins à la une
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez une sélection de praticiens hautement qualifiés et recommandés par nos utilisateurs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/doctors" className="btn-secondary group">
              Voir tous les médecins
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-medical-blue dark:bg-black" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-bold mb-8 leading-tight">
            Prêt à prendre votre premier <br className="hidden sm:block" /> rendez-vous ?
          </h2>
          <p className="text-lg text-white/80 mb-12 max-w-xl mx-auto">
            Rejoignez des milliers d'Algériens qui font confiance à Doctori pour leur santé.
            C'est gratuit et ça le restera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-white text-medical-blue hover:bg-gray-100 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
              S'inscrire gratuitement
            </Link>
            <Link to="/login" className="border-2 border-white/30 hover:bg-white/10 py-4 px-8 rounded-2xl font-bold text-lg transition-all w-full sm:w-auto">
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
