import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { doctors } from '../data/doctors';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

// Simulated doctor questions for consultation
const doctorQuestionFlows = {
  general: [
    "Bonjour ! Comment vous sentez-vous aujourd'hui ?",
    "Depuis quand ressentez-vous ces symptômes ?",
    "Avez-vous pris des médicaments récemment ?",
    "Avez-vous des allergies connues ?",
    "Avez-vous des antécédents médicaux particuliers ?",
    "Merci pour ces informations. Je vais analyser votre dossier et vous donner mes recommandations.",
  ],
  cardiologist: [
    "Bonjour ! Je suis votre cardiologue. Qu'est-ce qui vous amène aujourd'hui ?",
    "Ressentez-vous des douleurs thoraciques ou des palpitations ?",
    "Faites-vous de l'exercice physique régulièrement ?",
    "Avez-vous des antécédents de maladies cardiaques dans votre famille ?",
    "Quel est votre niveau de stress au quotidien ?",
    "Très bien. Je vous recommande un bilan cardiaque complet. Je vais préparer votre ordonnance.",
  ],
  dentist: [
    "Bonjour ! Quel est le motif de votre visite aujourd'hui ?",
    "Ressentez-vous des douleurs dentaires ? Si oui, où exactement ?",
    "Depuis combien de temps avez-vous ces symptômes ?",
    "Avez-vous une sensibilité au chaud ou au froid ?",
    "Quand avez-vous fait votre dernier détartrage ?",
    "D'accord. Nous allons programmer un examen approfondi avec une radio panoramique.",
  ],
};

const getInitialConversationsForRole = (user) => {
  if (user?.role === 'doctor') {
    return {
      'patient_1': {
        doctorId: 'patient_1', 
        doctorName: "Amine Khelil", 
        specialty: "Patient",
        status: "pending", 
        messages: [
          {
            id: 1,
            text: "Bonjour Docteur, j'ai pris un rendez-vous pour demain, mais il est toujours en attente d'approbation.",
            sender: "patient",
            time: "09:30",
            timestamp: Date.now() - 3600000,
          }
        ],
        questionIndex: 1,
        lastActivity: Date.now() - 3600000,
        unread: 1,
      },
      'patient_2': {
        doctorId: 'patient_2',
        doctorName: "Sarah Benali",
        specialty: "Patient",
        status: "approved",
        messages: [
          {
            id: 1,
            text: "Merci d'avoir approuvé mon rendez-vous. Dois-je ramener mes anciennes analyses ?",
            sender: "patient",
            time: "10:15",
            timestamp: Date.now() - 2500000,
          }
        ],
        questionIndex: 1,
        lastActivity: Date.now() - 2500000,
        unread: 1,
      },
      'patient_3': {
        doctorId: 'patient_3',
        doctorName: "Karim Ziani",
        specialty: "Patient",
        status: "pending",
        messages: [
          {
            id: 1,
            text: "Bonjour, je voudrais savoir s'il est possible d'avancer mon rendez-vous de 15h à 14h, c'est très urgent s'il vous plait. (Rendez-vous en attente)",
            sender: "patient",
            time: "11:45",
            timestamp: Date.now() - 1000000,
          }
        ],
        questionIndex: 1,
        lastActivity: Date.now() - 1000000,
        unread: 2,
      },
      'patient_4': {
        doctorId: 'patient_4',
        doctorName: "Lyna Mansouri",
        specialty: "Patient",
        status: "approved",
        messages: [
          {
            id: 1,
            text: "Bonjour, pourriez-vous m'envoyer l'ordonnance par message, je l'ai perdue ?",
            sender: "patient",
            time: "14:20",
            timestamp: Date.now() - 500000,
          }
        ],
        questionIndex: 1,
        lastActivity: Date.now() - 500000,
        unread: 1,
      }
    };
  }

  // If user is Abdou (the mock patient), return the original mock
  if (user?.name === 'Abdou Patient') {
    return {
      1: {
        doctorId: 1,
        doctorName: "Dr. MOHAMMED BENAHMED Aicha",
        specialty: "Médecin généraliste",
        messages: [
          {
            id: 1,
            text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
            sender: "doctor",
            time: "09:30",
            timestamp: Date.now() - 3600000,
          },
          {
            id: 2,
            text: "Bonjour Docteur, j'aimerais demander des détails concernant mon rendez-vous de demain.",
            sender: "patient",
            time: "09:32",
            timestamp: Date.now() - 3500000,
          },
        ],
        questionIndex: 1,
        lastActivity: Date.now() - 3500000,
        unread: 1,
      }
    };
  }
  
  // New patient accounts start with no conversations
  return {};
};

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState({});
  const [activeDoctorId, setActiveDoctorId] = useState(null);

  // Load conversations specifically for this user when user changes
  useEffect(() => {
    const userId = user?.id || 'default';
    const storageKey = `doctori_conversations_${userId}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setConversations(JSON.parse(saved));
    } else {
      const initial = getInitialConversationsForRole(user);
      setConversations(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
    setActiveDoctorId(null);
  }, [user]);

  const saveConversations = useCallback((newConversations) => {
    const userId = user?.id || 'default';
    setConversations(newConversations);
    localStorage.setItem(`doctori_conversations_${userId}`, JSON.stringify(newConversations));
  }, [user]);

  // Start or get a conversation with a doctor or patient
  const startConversation = useCallback((targetId, targetName = null) => {
    const doctor = doctors.find(d => d.id === targetId);
    
    const name = doctor ? doctor.name : (targetName || `Conversation ${targetId}`);
    const specialty = doctor ? doctor.specialty : "Patient";

    setActiveDoctorId(targetId);

    if (!conversations[targetId]) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const newConversations = {
        ...conversations,
        [targetId]: {
          doctorId: targetId, // Used as conversation ID
          doctorName: name,
          specialty: specialty,
          messages: [],
          questionIndex: 0,
          lastActivity: now.getTime(),
          unread: 0,
        },
      };
      saveConversations(newConversations);
    }
  }, [conversations, saveConversations]);

  // Send a message (can be sent by patient or doctor)
  const sendMessage = useCallback((doctorId, text, senderRole = 'patient') => {
    if (!text.trim()) return;

    const doctor = doctors.find(d => d.id === doctorId);
    const targetId = doctorId || 1;
    const conv = conversations[targetId] || {
      doctorId: targetId,
      doctorName: doctor?.name || "Nouvelle Conversation",
      specialty: doctor?.specialty || "Patient",
      messages: [],
      questionIndex: 0,
      lastActivity: Date.now(),
      unread: 0,
    };

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newMsg = {
      id: (conv.messages?.length || 0) + 1,
      text: text.trim(),
      sender: senderRole, // 'patient' or 'doctor'
      time: timeStr,
      timestamp: now.getTime(),
    };

    let newMessages = [...(conv.messages || []), newMsg];
    let newQuestionIndex = conv.questionIndex || 0;

    // Only auto-reply if the sender is patient
    if (senderRole === 'patient') {
      const specialtyFlow = doctorQuestionFlows.general;
      if (newQuestionIndex < specialtyFlow.length) {
        const doctorReplyTime = new Date(now.getTime() + 1000);
        const doctorTimeStr = `${doctorReplyTime.getHours().toString().padStart(2, '0')}:${doctorReplyTime.getMinutes().toString().padStart(2, '0')}`;
        
        const doctorMsg = {
          id: newMessages.length + 1,
          text: specialtyFlow[newQuestionIndex],
          sender: 'doctor',
          time: doctorTimeStr,
          timestamp: doctorReplyTime.getTime(),
          isAutoReply: true,
        };
        newMessages = [...newMessages, doctorMsg];
        newQuestionIndex += 1;
      }
    }

    const newConversations = {
      ...conversations,
      [targetId]: {
        ...conv,
        messages: newMessages,
        questionIndex: newQuestionIndex,
        lastActivity: now.getTime(),
        unread: senderRole === 'patient' ? 1 : 0,
      },
    };
    saveConversations(newConversations);
  }, [conversations, saveConversations]);

  // Mark conversation as read
  const markAsRead = useCallback((doctorId) => {
    if (!conversations[doctorId]) return;
    const newConversations = {
      ...conversations,
      [doctorId]: {
        ...conversations[doctorId],
        unread: 0,
      },
    };
    saveConversations(newConversations);
  }, [conversations, saveConversations]);

  // Get all conversations as a sorted list
  const getConversationList = useCallback(() => {
    return Object.values(conversations)
      .sort((a, b) => b.lastActivity - a.lastActivity)
      .map(conv => {
        const doctor = doctors.find(d => d.id === conv.doctorId);
        const lastMsg = conv.messages[conv.messages.length - 1];
        return {
          id: conv.doctorId,
          name: conv.doctorName,
          role: conv.specialty,
          avatar: doctor?.avatar || conv.doctorName.split(' ').map(n => n[0]).join('').slice(0, 2),
          color: doctor?.color || 'from-blue-500 to-indigo-600',
          lastMessage: lastMsg?.text || '',
          time: lastMsg?.time || '',
          unread: conv.unread || 0,
          online: true,
          status: conv.status || undefined,
        };
      });
  }, [conversations]);

  // Get messages for a specific doctor
  const getMessages = useCallback((doctorId) => {
    return conversations[doctorId]?.messages || [];
  }, [conversations]);

  // Get total unread count
  const getTotalUnread = useCallback(() => {
    return Object.values(conversations).reduce((sum, conv) => sum + (conv.unread || 0), 0);
  }, [conversations]);

  return (
    <MessageContext.Provider value={{
      conversations,
      activeDoctorId,
      setActiveDoctorId,
      startConversation,
      sendMessage,
      markAsRead,
      getConversationList,
      getMessages,
      getTotalUnread,
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
