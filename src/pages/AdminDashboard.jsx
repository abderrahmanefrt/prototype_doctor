import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Activity, TrendingUp, AlertCircle, CheckCircle, Clock, Search, ShieldCheck, UserCheck, UserX, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const initialStats = [
  { label: "Total Patients", value: "1,284", icon: Users, color: "bg-blue-500", trend: "+12%" },
  { label: "Total Médecins", value: "156", icon: Users, color: "bg-emerald-500", trend: "+5%" },
  { label: "Rendez-vous", value: "4,920", icon: Calendar, color: "bg-amber-500", trend: "+18%" },
  { label: "Consultations", value: "12,402", icon: Activity, color: "bg-rose-500", trend: "+24%" },
];

const mockDoctorsList = [
  { id: 1, name: "Dr. Amina Benali", specialty: "Cardiologie", status: "Actif", city: "Oran" },
  { id: 2, name: "Dr. Fatima Zahra Khelifi", specialty: "Dentiste", status: "En attente", city: "Sig" },
  { id: 3, name: "Dr. Samira Boudiaf", specialty: "Pédiatrie", status: "Actif", city: "Mascara" },
  { id: 4, name: "Dr. Khaled Mansouri", specialty: "Médecine Générale", status: "Actif", city: "Alger" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | doctors | system
  const [doctorsList, setDoctorsList] = useState(mockDoctorsList);
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleDoctorStatus = (id) => {
    setDoctorsList(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'Actif' ? 'Suspendu' : 'Actif';
        showNotification(`${d.name} est maintenant ${newStatus}`);
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const approveDoctor = (id) => {
    setDoctorsList(prev => prev.map(d => {
      if (d.id === id) {
        showNotification(`${d.name} a été approuvé avec succès !`);
        return { ...d, status: 'Actif' };
      }
      return d;
    }));
  };

  const filteredDoctors = doctorsList.filter(d =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-medical-blue" />
              <h1 className="text-3xl font-bold dark:text-white">Dashboard Admin</h1>
            </div>
            <p className="text-gray-500">Bienvenue, {user?.name || 'Administrateur Doctori'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => showNotification("Données rafraîchies à l'instant")} 
              className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="text-xs font-medium px-4 py-2 bg-medical-blue/10 text-medical-blue rounded-xl border border-medical-blue/20">
              Système: En ligne
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'doctors', label: 'Gestion des Médecins' },
            { id: 'system', label: 'État du Système' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-medical-blue text-white shadow-lg shadow-medical-blue/20'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {initialStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-3xl group hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="glass p-8 rounded-3xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-5 h-5 text-medical-blue" />
                  Activités Récentes
                </h2>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex gap-4 items-start pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item % 2 === 0 ? 'bg-medical-blue/10 text-medical-blue' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                        {item % 2 === 0 ? <Calendar className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">
                          {item % 2 === 0 ? "Nouveau rendez-vous pris" : "Nouveau médecin inscrit"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Il y a {item * 5} minutes - Par Patient Test</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Doctor Approvals */}
              <div className="glass p-8 rounded-3xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                  <UserCheck className="w-5 h-5 text-emerald-500" />
                  Demandes d'inscription
                </h2>
                <div className="space-y-4">
                  {doctorsList.filter(d => d.status === 'En attente').length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune demande en attente.</p>
                  ) : (
                    doctorsList.filter(d => d.status === 'En attente').map(doctor => (
                      <div key={doctor.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold dark:text-white">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.specialty} • {doctor.city}</p>
                        </div>
                        <button
                          onClick={() => approveDoctor(doctor.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                          Approuver
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'doctors' && (
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold dark:text-white">Liste des Médecins Inscrits</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, ville..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue/20 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <th className="px-4 py-3">Médecin</th>
                    <th className="px-4 py-3">Spécialité</th>
                    <th className="px-4 py-3">Ville</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-sm dark:text-white">{doc.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{doc.specialty}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{doc.city}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          doc.status === 'Actif' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                          doc.status === 'En attente' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {doc.status === 'En attente' ? (
                          <button
                            onClick={() => approveDoctor(doc.id)}
                            className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                          >
                            Approuver
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleDoctorStatus(doc.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              doc.status === 'Actif'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                            }`}
                          >
                            {doc.status === 'Actif' ? 'Suspendre' : 'Activer'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <Activity className="w-5 h-5 text-rose-500" />
              État du Système & Diagnostic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Base de données</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 rounded-lg">Opérationnel</span>
              </div>

              <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Système de messagerie</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 rounded-lg">Opérationnel</span>
              </div>

              <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-bold">Temps de réponse API</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-amber-500/10 rounded-lg">124ms</span>
              </div>

              <div className="p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Stockage</span>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-500/10 rounded-lg">Optimisé (12%)</span>
              </div>
            </div>
          </div>
        )}

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
