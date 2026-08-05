import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, ChevronRight, CheckCircle } from 'lucide-react';

export default function DoctorCard({ doctor, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-hover group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doctor.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-300`}>
              {doctor.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md">
              <div className="bg-emerald-500 rounded-full p-0.5">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate group-hover:text-medical-blue dark:group-hover:text-medical-accent transition-colors duration-200">
              {doctor.name}
            </h3>
            <p className="text-medical-blue dark:text-medical-accent font-medium text-sm">
              {doctor.specialty}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{doctor.city}</span>
              {doctor.distance !== undefined && (
                <span className="text-xs font-bold text-medical-blue bg-medical-blue/10 px-1.5 py-0.5 rounded ml-1">
                  {doctor.distance.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{doctor.rating}</span>
            <span className="text-xs text-gray-400">({doctor.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{doctor.experience} ans d'exp.</span>
          </div>
        </div>

        {/* Availability preview */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Prochaines disponibilités</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(doctor.availabilityCabinet).slice(0, 2).map(([day, slots]) => (
              slots.slice(0, 3).map((slot, i) => (
                <span
                  key={`${day}-${i}`}
                  className="px-2 py-1 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  {slot}
                </span>
              ))
            ))}
            <span className="px-2 py-1 text-xs rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 font-medium">
              +plus
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/doctors/${doctor.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-medical-blue hover:text-white dark:hover:bg-medical-blue transition-all duration-300 group/btn"
        >
          Voir le profil
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}
