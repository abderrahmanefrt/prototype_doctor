import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MoreVertical, Paperclip, Smile, ChevronLeft, MessageSquare, Bot, CheckCheck } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    activeDoctorId,
    setActiveDoctorId,
    getConversationList,
    getMessages,
    sendMessage,
    markAsRead,
  } = useMessages();
  
  const [newMessage, setNewMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const conversationList = getConversationList();
  const messages = activeDoctorId ? getMessages(activeDoctorId) : [];
  const activeChat = conversationList.find(c => c.id === activeDoctorId);

  const isDoctorUser = user?.role === 'doctor';

  // Filter conversations by search
  const filteredChats = conversationList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when selecting conversation
  useEffect(() => {
    if (activeDoctorId) {
      markAsRead(activeDoctorId);
    }
  }, [activeDoctorId, markAsRead]);

  // Auto-select first conversation on desktop if none selected
  useEffect(() => {
    if (!activeDoctorId && conversationList.length > 0 && window.innerWidth >= 768) {
      setActiveDoctorId(conversationList[0].id);
    }
  }, [conversationList, activeDoctorId, setActiveDoctorId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeDoctorId) return;

    sendMessage(activeDoctorId, newMessage, user?.role || 'patient');
    setNewMessage('');
    
    if (!isDoctorUser) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1200);
    }

    inputRef.current?.focus();
  };

  const selectChat = (chatId) => {
    setActiveDoctorId(chatId);
    markAsRead(chatId);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="pt-16 md:pt-20" style={{ height: '100dvh' }}>
      <div className="bg-white dark:bg-gray-900 overflow-hidden flex border border-gray-100 dark:border-gray-800 sm:rounded-none" style={{ height: 'calc(100dvh - 4rem)' }}>
        
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-full md:w-80' : 'hidden md:flex md:w-80'} border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0`}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold dark:text-white">
                {isDoctorUser ? 'Messages Patients' : 'Messages'}
              </h1>
              <span className="px-2.5 py-1 bg-medical-blue/10 text-medical-blue text-xs font-bold rounded-full">
                {conversationList.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder={isDoctorUser ? "Rechercher un patient..." : "Rechercher..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue/20 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Aucune conversation</p>
                <p className="text-xs text-gray-400 mt-1">
                  {isDoctorUser ? "Aucun message patient pour le moment" : "Visitez le profil d'un médecin pour commencer"}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full p-4 flex items-center gap-3 transition-all ${
                    activeDoctorId === chat.id 
                      ? 'bg-medical-blue/5 dark:bg-medical-blue/10 border-l-4 border-medical-blue' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-white font-bold shadow-md`}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold dark:text-white truncate">{chat.name}</h3>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-medical-blue rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-medical-blue/20">
                      {chat.unread}
                    </div>
                  )}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showSidebar ? 'w-full' : 'hidden md:flex md:flex-1'} flex flex-col bg-white dark:bg-gray-900 min-w-0`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5 dark:text-white" />
                  </button>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeChat.color} flex items-center justify-center text-white font-bold shadow-md`}>
                    {activeChat.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold dark:text-white flex items-center gap-2">
                      {activeChat.name}
                      {isDoctorUser && activeChat.status === 'pending' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-bold">
                          RDV en attente
                        </span>
                      )}
                      {isDoctorUser && activeChat.status === 'approved' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
                          RDV approuvé
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-[10px] font-medium text-green-600 uppercase tracking-tighter">En ligne</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30 dark:bg-gray-950/20">
                <div className="flex justify-center mb-4">
                  <div className="px-4 py-2 bg-medical-blue/5 dark:bg-medical-blue/10 rounded-2xl border border-medical-blue/10 dark:border-medical-blue/20">
                    <p className="text-[10px] text-center text-medical-blue font-medium">
                      🩺 Consultation Doctori — {isDoctorUser ? `Patient: ${activeChat.name}` : `Médecin: ${activeChat.name} (${activeChat.role})`}
                    </p>
                    {isDoctorUser && activeChat.status === 'pending' && (
                      <p className="text-[10px] text-center text-yellow-600 font-bold mt-1 max-w-sm mx-auto">
                        ⚠️ Ce patient a un rendez-vous en attente d'approbation. Vous pouvez discuter pour clarifier la situation avant d'approuver.
                      </p>
                    )}
                  </div>
                </div>

                {messages.map((msg) => {
                  const isMyMessage = isDoctorUser ? msg.sender === 'doctor' : msg.sender === 'patient';
                  return (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMyMessage && (
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeChat.color} flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0`}>
                          {msg.sender === 'doctor' ? activeChat.avatar.charAt(0) : 'P'}
                        </div>
                      )}
                      <div className={`max-w-[80%] sm:max-w-[65%] p-4 rounded-2xl shadow-sm text-sm ${
                        isMyMessage 
                          ? 'bg-medical-blue text-white rounded-tr-sm shadow-medical-blue/10' 
                          : 'bg-white dark:bg-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700'
                      }`}>
                        {!isMyMessage && (
                          <p className="text-[10px] font-bold text-medical-blue dark:text-medical-accent mb-1">
                            {isDoctorUser ? activeChat.name : activeChat.name}
                          </p>
                        )}
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-2 ${isMyMessage ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.time}
                          </span>
                          {isMyMessage && (
                            <CheckCheck className="w-3 h-3 text-blue-200" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeChat.color} flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0`}>
                        {activeChat.avatar.charAt(0)}
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                <form 
                  onSubmit={handleSend}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-medical-blue/30 transition-colors"
                >
                  <button type="button" className="p-2 text-gray-400 hover:text-medical-blue transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    type="text" 
                    placeholder={isDoctorUser ? "Écrivez votre message au patient..." : "Décrivez vos symptômes..."} 
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm dark:text-white px-2"
                  />
                  <button type="button" className="p-2 text-gray-400 hover:text-medical-blue transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="p-3 bg-medical-blue text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-medical-blue/20 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 dark:bg-gray-950/20">
              <div className="w-24 h-24 rounded-full bg-medical-blue/10 flex items-center justify-center text-medical-blue mb-4">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-bold dark:text-white mb-2">Messagerie Doctori</h2>
              <p className="text-gray-500 max-w-xs">Sélectionnez une conversation pour échanger.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
