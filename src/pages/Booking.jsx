import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, Mail, ChevronLeft,
  CheckCircle, AlertCircle, Building, Globe, MapPin, MessageSquare
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Toast from '../components/Toast';
import { doctors } from '../data/doctors';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startConversation } = useMessages();
  const { user } = useAuth();
  const doctor = doctors.find((d) => d.id === parseInt(id));

  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    email: user?.email || '',
    date: '',
    time: '',
    mode: 'cabinet', // Default mode
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // Helper to get French day name from date string
  const getDayName = (dateString) => {
    if (!dateString) return null;
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const selectedDayName = getDayName(formData.date);

  // Get available times based on selected mode AND selected day
  const currentPlanning = formData.mode === 'cabinet' 
    ? doctor.availabilityCabinet 
    : (doctor.availabilityDomicile || {});
  
  const availableTimes = selectedDayName ? (currentPlanning[selectedDayName] || []) : [];

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.time) newErrors.time = "L'heure est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (user?.id) {
        const appointmentId = `apt-${Date.now()}`;
        
        // 1. Save to patient dashboard
        const stored = JSON.parse(localStorage.getItem(`doctori_patient_appointments_${user.id}`) || '[]');
        stored.push({
          id: appointmentId,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          date: formData.date,
          time: formData.time,
          mode: formData.mode,
          status: 'En attente'
        });
        localStorage.setItem(`doctori_patient_appointments_${user.id}`, JSON.stringify(stored));

        // 2. Save to doctor dashboard
        const initialDoctorAppointments = [
          {
            id: 'apt-1', patientName: 'Mohamed Benali', patientPhone: '0551234567', patientEmail: 'mohamed@email.com', date: '2026-08-06', dayName: 'Jeudi', time: '10:00', mode: 'cabinet', status: 'En attente', reason: 'Consultation de suivi annuel',
          },
          {
            id: 'apt-2', patientName: 'Amina Khelil', patientPhone: '0779876543', patientEmail: 'amina@email.com', date: '2026-08-09', dayName: 'Dimanche', time: '14:30', mode: 'domicile', status: 'Confirmé', reason: 'Visite à domicile - Douleurs articulaires',
          },
          {
            id: 'apt-3', patientName: 'Youcef Belhadj', patientPhone: '0661122334', patientEmail: 'youcef@email.com', date: '2026-08-10', dayName: 'Lundi', time: '11:00', mode: 'cabinet', status: 'En attente', reason: 'Contrôle tension artérielle',
          },
          {
            id: 'apt-4', patientName: 'Sarah Mansouri', patientPhone: '0554433221', patientEmail: 'sarah@email.com', date: '2026-08-11', dayName: 'Mardi', time: '16:00', mode: 'cabinet', status: 'Refusé', reason: 'Bilan sanguin',
          },
        ];
        
        const doctorStored = JSON.parse(localStorage.getItem('doctori_doctor_appointments') || 'null') || initialDoctorAppointments;
        doctorStored.unshift({
          id: appointmentId,
          patientName: user.name,
          patientPhone: user.phone || '06 00 00 00 00',
          patientEmail: user.email,
          date: formData.date,
          dayName: getDayName(formData.date),
          time: formData.time,
          mode: formData.mode,
          status: 'En attente',
          reason: 'Nouvelle réservation en ligne'
        });
        localStorage.setItem('doctori_doctor_appointments', JSON.stringify(doctorStored));
      }

      setIsSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1200);
  };

  const handleContactDoctor = () => {
    startConversation(doctor.id);
    navigate('/messages');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-select first available (non-booked) time slot when date or mode changes
      if (field === 'date' || field === 'mode') {
        const day = getDayName(newData.date);
        const planning = newData.mode === 'cabinet' ? doctor.availabilityCabinet : (doctor.availabilityDomicile || {});
        const slots = day ? (planning[day] || []) : [];
        const availableSlots = slots.filter(s => !doctor.bookedSlots?.includes(`${day}-${s}`));
        newData.time = availableSlots.length > 0 ? availableSlots[0] : '';
      }
      
      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isBooked = (time) => {
    if (!selectedDayName) return false;
    return doctor.bookedSlots?.includes(`${selectedDayName}-${time}`);
  };

  return (
    <PageTransition>
      <section className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-medical-pale/30 to-transparent dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>

          {submitted ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 sm:p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Rendez-vous confirmé !
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Votre rendez-vous avec <span className="font-semibold text-gray-700 dark:text-gray-300">{doctor.name}</span> a été 
                enregistré avec succès. Vous recevrez un email de confirmation.
              </p>

              <div className="card p-6 mb-8 text-left max-w-sm mx-auto">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Patient</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{formData.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {formData.mode === 'cabinet' ? 'Au cabinet' : 'À domicile'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lieu</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {formData.mode === 'cabinet' ? doctor.clinicName : 'Votre domicile'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Heure</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{formData.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleContactDoctor}
                  className="btn-primary"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contacter le médecin
                </button>
                <Link to="/" className="btn-secondary">
                  Retour à l'accueil
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Booking Form */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Doctor Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1"
              >
                <div className="card p-6 lg:sticky lg:top-24">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doctor.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {doctor.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
                      <p className="text-sm text-medical-blue dark:text-medical-accent font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-start gap-2">
                      <Building className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {doctor.clinicName}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {doctor.address}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <div className="card p-6 sm:p-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Prendre rendez-vous
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Remplissez le formulaire ci-dessous pour réserver votre créneau
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Consultation Mode */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Mode de consultation
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleChange('mode', 'cabinet')}
                          className={`p-4 rounded-2xl border-2 transition-all text-left ${
                            formData.mode === 'cabinet'
                              ? 'border-medical-blue bg-medical-blue/5 dark:bg-medical-blue/10'
                              : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                          }`}
                        >
                          <Building className={`w-6 h-6 mb-2 ${formData.mode === 'cabinet' ? 'text-medical-blue' : 'text-gray-400'}`} />
                          <p className="font-bold text-sm text-gray-900 dark:text-white">Au cabinet</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Consultation classique</p>
                        </button>
                        
                        <button
                          type="button"
                          disabled={!doctor.availabilityDomicile}
                          onClick={() => handleChange('mode', 'domicile')}
                          className={`p-4 rounded-2xl border-2 transition-all text-left ${
                            !doctor.availabilityDomicile ? 'opacity-40 cursor-not-allowed' :
                            formData.mode === 'domicile'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                              : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                          }`}
                        >
                          <Globe className={`w-6 h-6 mb-2 ${formData.mode === 'domicile' ? 'text-emerald-500' : 'text-gray-400'}`} />
                          <p className="font-bold text-sm text-gray-900 dark:text-white">À domicile</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Le médecin se déplace</p>
                        </button>
                      </div>
                    </div>
                    {/* Patient Name - Removed as it's fetched from user */}
                    {/* Email - Removed as it's fetched from user */}

                    {/* Date */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4" />
                        Date du rendez-vous
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`input-field ${errors.date ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
                      />
                      {errors.date && (
                        <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.date}
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-4 h-4" />
                        Heure du rendez-vous
                      </label>
                      {!formData.date ? (
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                          <p className="text-sm text-gray-500">Veuillez d'abord choisir une date</p>
                        </div>
                      ) : availableTimes.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {availableTimes.map((time) => {
                             const booked = isBooked(time);
                             return (
                            <button
                              key={time}
                              type="button"
                              disabled={booked}
                              onClick={() => handleChange('time', time)}
                              className={`py-2.5 px-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                                booked
                                  ? 'bg-red-500/10 text-red-600 border border-red-200 cursor-not-allowed'
                                  : formData.time === time
                                    ? 'bg-medical-blue text-white shadow-lg shadow-medical-blue/25'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {time}
                              {booked && <p className="text-[8px] font-bold">OCCUPÉ</p>}
                            </button>
                          )})}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-center">
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            Pas de disponibilités le {selectedDayName}. Veuillez choisir un autre jour.
                          </p>
                        </div>
                      )}
                      {errors.time && (
                        <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.time}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center text-base !py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Confirmation en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Confirmer le rendez-vous
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
      <Toast show={showToast} onClose={() => setShowToast(false)} />
    </PageTransition>
  );
}
