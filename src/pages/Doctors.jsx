import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import DoctorCard from '../components/DoctorCard';
import { doctors, specialties, cities } from '../data/doctors';

const SIG_COORDS = { lat: 35.5303, lng: -0.1917 };

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDoctors = useMemo(() => {
    const list = doctors.map(doctor => {
      const dist = calculateDistance(SIG_COORDS.lat, SIG_COORDS.lng, doctor.lat, doctor.lng);
      return { ...doctor, distance: dist };
    }).filter((doctor) => {
      const matchesSearch =
        searchQuery === '' ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'all' || doctor.specialtyKey === selectedSpecialty;

      const matchesCity =
        selectedCity === 'Toutes les villes' || doctor.city === selectedCity;

      return matchesSearch && matchesSpecialty && matchesCity;
    });

    return list.sort((a, b) => a.distance - b.distance);
  }, [searchQuery, selectedSpecialty, selectedCity]);

  const activeFiltersCount =
    (selectedSpecialty !== 'all' ? 1 : 0) +
    (selectedCity !== 'Toutes les villes' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedCity('Toutes les villes');
  };

  return (
    <PageTransition>
      {/* Header */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-medical-pale/50 to-transparent dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="section-title mb-2">
              Nos <span className="text-gradient">Médecins</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filteredDoctors.length} praticien{filteredDoctors.length !== 1 ? 's' : ''} disponible{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un médecin, spécialité, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-medical-blue text-white border-medical-blue'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-medical-blue text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden sm:flex gap-3">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="input-field !w-auto min-w-[180px] cursor-pointer"
              >
                {specialties.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input-field !w-auto min-w-[160px] pl-9 cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-medical-blue dark:text-medical-accent hover:bg-medical-blue/10 dark:hover:bg-medical-accent/10 transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3"
            >
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="input-field cursor-pointer"
              >
                {specialties.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-sm font-medium text-medical-blue dark:text-medical-accent"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, i) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <button onClick={clearFilters} className="btn-primary text-sm">
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
