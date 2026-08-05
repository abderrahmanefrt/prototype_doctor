import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Target, Eye, Users, Globe, Zap,
  ChevronRight, Award, TrendingUp, Building2
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

export default function About() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-medical-pale/50 to-transparent dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="badge mb-4">À propos de nous</span>
            <h1 className="section-title mb-6">
              Digitaliser la santé en{' '}
              <span className="text-gradient">Algérie</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              Doctori est né de la conviction que chaque Algérien mérite un accès simple et rapide
              aux soins de santé. Nous construisons le pont numérique entre les patients et les
              professionnels de santé à travers tout le pays.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Fondée en 2026 à Sig (Mascara), Doctori est une plateforme healthtech algérienne
                  qui ambitionne de révolutionner l'accès aux soins dans le pays. Face aux
                  longues files d'attente, aux difficultés à trouver un spécialiste et au
                  manque d'information sur les praticiens disponibles, nous avons décidé d'agir.
                </p>
                <p>
                  Notre équipe de passionnés combine expertise médicale, technologique et design
                  pour créer une plateforme intuitive qui répond aux besoins réels des patients
                  et des médecins algériens.
                </p>
                <p>
                  Aujourd'hui, Doctori couvre les principales wilayas du pays et continue
                  de s'étendre pour offrir ses services au plus grand nombre.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'Patients actifs', value: '10K+', color: 'from-blue-500 to-cyan-500' },
                { icon: Award, label: 'Médecins certifiés', value: '500+', color: 'from-emerald-500 to-teal-500' },
                { icon: Globe, label: 'Wilayas couvertes', value: '48', color: 'from-violet-500 to-purple-500' },
                { icon: TrendingUp, label: 'Taux satisfaction', value: '98%', color: 'from-amber-500 to-orange-500' },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card p-6 text-center hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="card p-8 sm:p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-blue to-medical-light flex items-center justify-center shadow-lg mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notre Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Devenir la référence digitale incontournable de la santé en Algérie,
                en rendant l'accès aux soins aussi simple qu'une recherche sur internet.
                Nous rêvons d'un pays où chaque citoyen peut accéder facilement à un professionnel de santé qualifié.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="card p-8 sm:p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notre Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Simplifier la prise de rendez-vous médicaux en Algérie grâce à une plateforme
                numérique moderne, accessible et gratuite pour les patients. Nous connectons
                les praticiens et leurs patients à travers une expérience fluide et transparente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="badge mb-4">Ce en quoi nous croyons</span>
            <h2 className="section-title">
              Nos <span className="text-gradient">valeurs</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Humanité',
                description: 'Le patient est au cœur de toutes nos décisions. Nous plaçons le bien-être humain avant tout.',
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Nous utilisons les dernières technologies pour résoudre des problèmes concrets du quotidien médical.',
              },
              {
                icon: Building2,
                title: 'Accessibilité',
                description: 'Nous croyons que chaque Algérien, peu importe sa localisation, mérite un accès facile aux soins.',
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'Nous visons les plus hauts standards de qualité dans tout ce que nous faisons.',
              },
            ].map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 text-center hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-medical-pale dark:bg-medical-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-medical-blue dark:text-medical-accent" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="card bg-gradient-to-br from-medical-blue via-medical-dark to-blue-900 border-none p-8 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rejoignez l'aventure Doctori
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Que vous soyez patient ou professionnel de santé,
              Doctori est fait pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/doctors" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-medical-blue font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Trouver un médecin
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
