import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Building, Globe, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { MessageSquare } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { startConversation } = useMessages();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load patient appointments from local storage
    const userId = user?.id || 'default';
    const saved = localStorage.getItem(`doctori_patient_appointments_${userId}`);
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  }, [user]);

  const handleCancelAppointment = (aptId) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;

    setAppointments((prev) => {
      const updated = prev.map((apt) => {
        if (apt.id === aptId) {
          return { ...apt, status: 'Annulé' };
        }
        return apt;
      });
      const userId = user?.id || 'default';
      localStorage.setItem(`doctori_patient_appointments_${userId}`, JSON.stringify(updated));
      return updated;
    });

    // Sync to doctor's list
    const docStored = JSON.parse(localStorage.getItem('doctori_doctor_appointments') || '[]');
    const updatedDocStored = docStored.map(dApt => {
      if (dApt.id === aptId) {
        return { ...dApt, status: 'Annulé par le patient' };
      }
      return dApt;
    });
    localStorage.setItem('doctori_doctor_appointments', JSON.stringify(updatedDocStored));
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
        
        {/* Header */}
        <div className="card p-6 sm:p-8 bg-gradient-to-r from-medical-blue via-blue-600 to-indigo-700 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 min-w-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bonjour, {user?.name}</h1>
              <p className="text-blue-100">Bienvenue sur votre espace patient Doctori.</p>
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-sm font-bold">
              Patient
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white mb-4">Mes Rendez-vous</h2>
            
            {appointments.length === 0 ? (
              <div className="card p-12 flex flex-col items-center text-center justify-center border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="w-16 h-16 rounded-full bg-medical-blue/10 flex items-center justify-center text-medical-blue mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Vous n'avez pas encore pris de rendez-vous. Recherchez un médecin et réservez une consultation.
                </p>
                <a href="/doctors" className="btn-primary">
                  Trouver un médecin
                </a>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-medical-blue/10 text-medical-blue flex items-center justify-center font-bold text-lg shrink-0 mt-1">
                        {apt.doctorName?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{apt.doctorName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{apt.specialty}</p>
                        
                        <div className="flex flex-wrap gap-3 text-xs font-semibold">
                          <span className="flex items-center gap-1 text-medical-blue dark:text-medical-accent bg-medical-blue/10 px-2 py-1 rounded-lg">
                            <Calendar className="w-3.5 h-3.5" />
                            {apt.date} à {apt.time}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-lg">
                            {apt.mode === 'cabinet' ? <Building className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                            {apt.mode === 'cabinet' ? 'Cabinets' : 'À Domicile'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    
                    <div className="w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0 border-gray-100 dark:border-gray-800 flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        apt.status === 'Confirmé' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        apt.status === 'En attente' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {apt.status === 'Confirmé' && <CheckCircle className="w-4 h-4" />}
                        {apt.status === 'En attente' && <AlertCircle className="w-4 h-4" />}
                        {(apt.status === 'Refusé' || apt.status === 'Annulé') && <XCircle className="w-4 h-4" />}
                        {apt.status || 'En attente'}
                      </span>

                      <div className="flex w-full sm:w-auto gap-2">
                        <button
                          onClick={() => {
                            startConversation(apt.doctorId, apt.doctorName);
                            navigate('/messages');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Message
                        </button>
                        
                        {(apt.status === 'En attente' || apt.status === 'Confirmé') && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
