import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Plus,
  User, Phone, Mail, Edit3, MessageSquare, Trash2, Check, X, Shield,
  Building, Globe, Filter, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Toast from '../components/Toast';

// Mock initial incoming appointments for the doctor
const initialAppointments = [
  {
    id: 'apt-1',
    patientName: 'Mohamed Benali',
    patientPhone: '0551234567',
    patientEmail: 'mohamed@email.com',
    date: '2026-08-06',
    dayName: 'Jeudi',
    time: '10:00',
    mode: 'cabinet',
    status: 'En attente',
    reason: 'Consultation de suivi annuel',
  },
  {
    id: 'apt-2',
    patientName: 'Amina Khelil',
    patientPhone: '0779876543',
    patientEmail: 'amina@email.com',
    date: '2026-08-09',
    dayName: 'Dimanche',
    time: '14:30',
    mode: 'domicile',
    status: 'Confirmé',
    reason: 'Visite à domicile - Douleurs articulaires',
  },
  {
    id: 'apt-3',
    patientName: 'Youcef Belhadj',
    patientPhone: '0661122334',
    patientEmail: 'youcef@email.com',
    date: '2026-08-10',
    dayName: 'Lundi',
    time: '11:00',
    mode: 'cabinet',
    status: 'En attente',
    reason: 'Contrôle tension artérielle',
  },
  {
    id: 'apt-4',
    patientName: 'Sarah Mansouri',
    patientPhone: '0554433221',
    patientEmail: 'sarah@email.com',
    date: '2026-08-11',
    dayName: 'Mardi',
    time: '16:00',
    mode: 'cabinet',
    status: 'Refusé',
    reason: 'Bilan sanguin',
  },
];

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];

const defaultPlanningCabinet = {
  Dimanche: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  Lundi: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  Mardi: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  Mercredi: ['09:00', '10:00', '11:00', '14:00'],
  Jeudi: ['09:00', '10:00', '11:00', '14:00'],
};

const defaultPlanningDomicile = {
  Dimanche: ['17:00', '18:00'],
  Mardi: ['17:00', '18:00'],
  Jeudi: ['15:00', '16:00', '17:00'],
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { startConversation } = useMessages();
  const navigate = useNavigate();

  // Active view tab: 'overview' | 'appointments' | 'schedule'
  const [activeTab, setActiveTab] = useState('overview');

  // Appointments state
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('doctori_doctor_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [appointmentFilter, setAppointmentFilter] = useState('Tous'); // Tous | En attente | Confirmé | Refusé

  // Planning state per day
  const [planningCabinet, setPlanningCabinet] = useState(() => {
    const saved = localStorage.getItem('doctori_doctor_planning_cabinet');
    return saved ? JSON.parse(saved) : defaultPlanningCabinet;
  });

  const [planningDomicile, setPlanningDomicile] = useState(() => {
    const saved = localStorage.getItem('doctori_doctor_planning_domicile');
    return saved ? JSON.parse(saved) : defaultPlanningDomicile;
  });

  const [selectedDay, setSelectedDay] = useState('Dimanche');
  const [planningMode, setPlanningMode] = useState('cabinet'); // cabinet | domicile
  const [newSlotTime, setNewSlotTime] = useState('08:00');

  // Profile edit modal state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Dr. MOHAMMED BENAHMED Aicha',
    specialty: 'Médecin généraliste',
    phone: '0795737416',
    email: user?.email || 'dr.benahmed@doctori.dz',
    city: 'Sig, Mascara',
  });

  // Notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('doctori_doctor_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('doctori_doctor_planning_cabinet', JSON.stringify(planningCabinet));
  }, [planningCabinet]);

  useEffect(() => {
    localStorage.setItem('doctori_doctor_planning_domicile', JSON.stringify(planningDomicile));
  }, [planningDomicile]);

  const syncStatusToPatient = (apt, newStatus) => {
    if (apt.patientId) {
      const patientStored = JSON.parse(localStorage.getItem(`doctori_patient_appointments_${apt.patientId}`) || '[]');
      const updated = patientStored.map(pApt => {
        if (pApt.id === apt.id) return { ...pApt, status: newStatus };
        return pApt;
      });
      localStorage.setItem(`doctori_patient_appointments_${apt.patientId}`, JSON.stringify(updated));
    }
  };

  // Appointment Status Handlers
  const handleApproveAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          showNotification(`Rendez-vous de ${apt.patientName} approuvé !`);
          syncStatusToPatient(apt, 'Confirmé');
          return { ...apt, status: 'Confirmé' };
        }
        return apt;
      })
    );
  };

  const handleRejectAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          showNotification(`Rendez-vous de ${apt.patientName} refusé.`);
          syncStatusToPatient(apt, 'Refusé');
          return { ...apt, status: 'Refusé' };
        }
        return apt;
      })
    );
  };

  const handleCancelAppointment = (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          showNotification(`Rendez-vous de ${apt.patientName} annulé.`);
          syncStatusToPatient(apt, 'Annulé par le médecin');
          return { ...apt, status: 'Annulé par le médecin' };
        }
        return apt;
      })
    );
  };

  const handleContactPatient = (apt) => {
    startConversation(apt.id, apt.patientName);
    navigate('/messages');
  };

  // Planning Handlers (Add/Remove slots)
  const handleAddSlot = () => {
    if (!newSlotTime) return;
    const targetPlanning = planningMode === 'cabinet' ? planningCabinet : planningDomicile;
    const currentSlots = targetPlanning[selectedDay] || [];

    if (currentSlots.includes(newSlotTime)) {
      showNotification('Ce créneau existe déjà !');
      return;
    }

    const updatedSlots = [...currentSlots, newSlotTime].sort();

    if (planningMode === 'cabinet') {
      setPlanningCabinet({ ...planningCabinet, [selectedDay]: updatedSlots });
    } else {
      setPlanningDomicile({ ...planningDomicile, [selectedDay]: updatedSlots });
    }

    showNotification(`Créneau ${newSlotTime} ajouté pour ${selectedDay} (${planningMode})`);
  };

  const handleRemoveSlot = (slotToRemove) => {
    const targetPlanning = planningMode === 'cabinet' ? planningCabinet : planningDomicile;
    const currentSlots = targetPlanning[selectedDay] || [];
    const updatedSlots = currentSlots.filter((slot) => slot !== slotToRemove);

    if (planningMode === 'cabinet') {
      setPlanningCabinet({ ...planningCabinet, [selectedDay]: updatedSlots });
    } else {
      setPlanningDomicile({ ...planningDomicile, [selectedDay]: updatedSlots });
    }

    showNotification(`Créneau ${slotToRemove} supprimé de ${selectedDay}`);
  };

  // Filtered appointments list
  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === 'Tous') return true;
    return apt.status === appointmentFilter;
  });

  const pendingCount = appointments.filter((a) => a.status === 'En attente').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmé').length;

  return (
    <PageTransition>
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="card p-6 sm:p-8 bg-gradient-to-r from-medical-blue via-blue-700 to-indigo-800 text-white border-none shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 min-w-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/30">
                {profileData.name.charAt(4) || 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold break-words">{profileData.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    Médecin Vérifié
                  </span>
                </div>
                <p className="text-blue-100 text-sm mt-1 break-words">{profileData.specialty} • {profileData.city} • Tél: {profileData.phone}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-sm font-semibold flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Éditer le profil
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="btn-primary !bg-white !text-medical-blue hover:!bg-blue-50 text-sm font-bold flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Messagerie Patients
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: "Vue d'ensemble" },
            { id: 'appointments', label: `Demandes de Rendez-vous (${pendingCount > 0 ? pendingCount + ' en attente' : '0'})` },
            { id: 'schedule', label: 'Gestion des Créneaux & Planning' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-medical-blue text-white shadow-lg shadow-medical-blue/20'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveTab('appointments')}
                className="card p-6 cursor-pointer hover:border-amber-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                    En attente
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">Demandes de RDV</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{pendingCount}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setActiveTab('appointments')}
                className="card p-6 cursor-pointer hover:border-emerald-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    Confirmés
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">RDV Validés</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{confirmedCount}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setActiveTab('schedule')}
                className="card p-6 cursor-pointer hover:border-blue-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    Cabinet
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">Créneaux Aujourd'hui</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {(planningCabinet['Dimanche'] || []).length} créneaux
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigate('/messages')}
                className="card p-6 cursor-pointer hover:border-purple-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                    Messages
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">Discussions Patients</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">Actives</p>
              </motion.div>
            </div>

            {/* Recent Appointments Preview */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Dernières demandes reçues</h2>
                  <p className="text-sm text-gray-500">Approuvez ou refusez directement les créneaux demandés</p>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-sm font-bold text-medical-blue hover:underline"
                >
                  Voir tout
                </button>
              </div>

              <div className="space-y-4">
                {appointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-medical-blue/10 text-medical-blue flex items-center justify-center font-bold">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{apt.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {apt.dayName} {apt.date} à {apt.time} • <span className="font-semibold">{apt.mode === 'cabinet' ? 'Cabinet' : 'À domicile'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          apt.status === 'Confirmé'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : apt.status === 'En attente'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {apt.status}
                      </span>

                      {apt.status === 'En attente' && (
                        <>
                          <button
                            onClick={() => handleApproveAppointment(apt.id)}
                            className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                            title="Approuver"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectAppointment(apt.id)}
                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                            title="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {apt.status === 'Confirmé' && (
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-sm"
                          title="Annuler le rendez-vous"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENT REQUESTS MANAGEMENT (Approuver / Refuser) */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Gestion des Rendez-vous</h2>
                  <p className="text-sm text-gray-500">Validez ou refusez les créneaux sollicités par vos patients</p>
                </div>

                {/* Filter Selector */}
                <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl max-w-full">
                  {['Tous', 'En attente', 'Confirmé', 'Refusé'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setAppointmentFilter(f)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                        appointmentFilter === f
                          ? 'bg-white dark:bg-gray-700 text-medical-blue dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-base">Aucun rendez-vous dans cette catégorie</p>
                  </div>
                ) : (
                  filteredAppointments.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-medical-blue/10 text-medical-blue flex items-center justify-center font-bold text-lg shrink-0">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base">{apt.patientName}</h3>
                            <span className="text-xs text-gray-400">• Tél: {apt.patientPhone}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1 font-semibold text-medical-blue">
                              <Calendar className="w-3.5 h-3.5" />
                              {apt.dayName} {apt.date} à {apt.time}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                              {apt.mode === 'cabinet' ? <Building className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                              {apt.mode === 'cabinet' ? 'Au Cabinet' : 'À Domicile'}
                            </span>
                          </p>
                          {apt.reason && (
                            <p className="text-xs text-gray-400 mt-1 italic">Motif: "{apt.reason}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-700">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                            apt.status === 'Confirmé'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : apt.status === 'En attente'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {apt.status}
                        </span>

                        <button
                          onClick={() => handleContactPatient(apt)}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Message
                        </button>

                        {apt.status === 'En attente' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveAppointment(apt.id)}
                              className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approuver
                            </button>
                            <button
                              onClick={() => handleRejectAppointment(apt.id)}
                              className="px-4 py-1.5 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Refuser
                            </button>
                          </div>
                        )}

                        {apt.status === 'Confirmé' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-4 py-1.5 bg-gray-500 text-white rounded-xl text-xs font-bold hover:bg-gray-600 transition-colors shadow-sm flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Annuler le RDV
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE & SLOT MANAGEMENT */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Gestion des Créneaux Horaires</h2>
                  <p className="text-sm text-gray-500">Ajoutez ou supprimez vos heures de consultation pour chaque jour</p>
                </div>

                {/* Cabinet / Domicile Mode Switcher */}
                <div className="flex flex-wrap p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  <button
                    onClick={() => setPlanningMode('cabinet')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      planningMode === 'cabinet' ? 'bg-medical-blue text-white shadow-md' : 'text-gray-500'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    Consultation Cabinet
                  </button>
                  <button
                    onClick={() => setPlanningMode('domicile')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      planningMode === 'domicile' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Consultation Domicile
                  </button>
                </div>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-6 overflow-x-auto">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedDay === day
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Add New Time Slot Form */}
              <div className="p-4 bg-medical-blue/5 dark:bg-medical-blue/10 border border-medical-blue/20 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-medical-blue text-white rounded-xl">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Ajouter un créneau le {selectedDay} ({planningMode === 'cabinet' ? 'Cabinet' : 'Domicile'})
                    </p>
                    <p className="text-xs text-gray-500">Choisissez l'heure de rendez-vous disponible pour vos patients</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="time"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="input-field !py-2 !px-3 text-sm font-bold w-32"
                  />
                  <button
                    onClick={handleAddSlot}
                    className="btn-primary text-xs !py-2.5 !px-4 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter Créneau
                  </button>
                </div>
              </div>

              {/* Display Current Slots for Selected Day */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                  <span>Créneaux configurés le {selectedDay}</span>
                  <span className="text-xs font-normal text-gray-400">
                    {((planningMode === 'cabinet' ? planningCabinet : planningDomicile)[selectedDay] || []).length} créneaux
                  </span>
                </h3>

                {((planningMode === 'cabinet' ? planningCabinet : planningDomicile)[selectedDay] || []).length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-400">Aucun créneau configuré pour ce jour.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {((planningMode === 'cabinet' ? planningCabinet : planningDomicile)[selectedDay] || []).map((slot) => (
                      <motion.div
                        key={slot}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-red-400 transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-medical-blue" />
                          {slot}
                        </span>
                        <button
                          onClick={() => handleRemoveSlot(slot)}
                          className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title="Supprimer le créneau"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDIT PROFILE */}
        <AnimatePresence>
          {showEditProfileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold dark:text-white">Modifier le Profil Médecin</h3>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Nom et Prénom</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Spécialité</label>
                    <input
                      type="text"
                      value={profileData.specialty}
                      onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">Ville / Adresse</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setShowEditProfileModal(false);
                        showNotification('Profil mis à jour avec succès !');
                      }}
                      className="btn-primary flex-1 justify-center"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-emerald-500/10 border border-emerald-200 dark:border-emerald-800/50 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{toastMessage}</p>
              <button onClick={() => setToastMessage(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ml-auto">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
