import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  MessageSquare,
  Bot,
  Zap,
} from 'lucide-react';
import { KageLandingPage } from './shaders/landing-pages/LandingPages';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import QuickPrompts from './components/QuickPrompts';
import AboutModal from './components/AboutModal';
import SettingsModal from './components/SettingsModal';
import FeedbackModal from './components/FeedbackModal';
import { useChat } from './hooks/useChat';
import { useSpeech } from './hooks/useSpeech';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'chat'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState(null);
  const [feedbackInitialRating, setFeedbackInitialRating] = useState(1);
  const [inputText, setInputText] = useState('');

  const messagesEndRef = useRef(null);

  // Chat management hook
  const {
    chats,
    currentChatId,
    currentChat,
    messages,
    mode,
    setMode,
    isLoading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    selectChat,
    startNewChat,
    sendMessage,
    toggleMessageMode,
    deleteChat,
    submitFeedback,
    refreshChats,
  } = useChat();

  // Speech-to-text & text-to-speech hook
  const {
    isListening,
    toggleListening,
    speakText,
    isSpeaking,
    speechSupported,
  } = useSpeech({
    onSpeechResult: (transcript) => {
      setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view, isLoading]);

  // Listen to open-easyassist-chat messages from the Kage iframe
  useEffect(() => {
    const handleMsg = (e) => {
      if (e.data?.type === 'open-easyassist-chat') {
        setView('chat');
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputText;
    if (!text || !text.trim() || isLoading) return;

    setInputText('');
    if (view !== 'chat') {
      setView('chat');
    }
    await sendMessage(text);
  };

  // Quick prompt selection handler
  const handleSelectPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  // Select chat from sidebar
  const handleSelectChat = (chatId) => {
    selectChat(chatId);
    if (view !== 'chat') {
      setView('chat');
    }
    setIsMobileSidebarOpen(false);
  };

  // Start fresh chat
  const handleNewChat = () => {
    startNewChat();
    if (view !== 'chat') {
      setView('chat');
    }
    setIsMobileSidebarOpen(false);
  };

  // Trigger feedback modal for a specific message
  const handleFeedbackClick = (msgId, rating) => {
    setFeedbackMessageId(msgId);
    setFeedbackInitialRating(rating);
    setIsFeedbackOpen(true);
  };

  return (
    <div className="app-container" style={{ background: '#05070a', color: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* ===================== VIEW 1: AUTHENTIC KAGE LANDING PAGE ===================== */}
      {view === 'landing' ? (
        <div
          className="kage-page-wrapper"
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#05070a',
          }}
        >
          {/* Canonical ThreeUI Kage Landing Page Experience */}
          <KageLandingPage
            headingFont="onest"
            bodyFont="onest"
            headingWeight="400"
            bodyWeight="300"
            primaryColor="#e0231c"
            headingSize={46}
            bodySize={17}
            headingLetterSpacing={-0.012}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />

          {/* Floating EasyAssist AI Sanctuary Dock */}
          <div
            className="kage-floating-action-dock"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '28px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(5, 7, 10, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(223, 231, 224, 0.16)',
              borderRadius: '9999px',
              padding: '7px 18px 7px 14px',
              boxShadow: '0 18px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(224, 35, 28, 0.22)',
              fontFamily: "'Onest', sans-serif",
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e0231c, #9e1410)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 14px rgba(224, 35, 28, 0.6)',
              }}
            >
              <Sparkles size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#dfe7e0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>EasyAssist AI</span>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'rgba(223, 231, 224, 0.5)' }}>案内</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a4b3a8' }}>
                Intelligent Simplification
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView('chat')}
              style={{
                background: '#e0231c',
                border: 'none',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '7px 15px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: '6px',
                boxShadow: '0 4px 14px rgba(224, 35, 28, 0.45)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff382e';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#e0231c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Open AI Workspace</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        /* ===================== VIEW 2: KAGE-THEMED EASYASSIST CHAT WORKSPACE ===================== */
        <div className="chat-layout" style={{ background: '#05070a' }}>
          {/* Collapsible Sidebar */}
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={deleteChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAbout={() => setIsAboutOpen(true)}
            onNavigateHome={() => setView('landing')}
          />

          {/* Chat Main Window */}
          <main className="chat-main" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(224, 35, 28, 0.05), transparent 70%), #05070a' }}>
            <Header
              mode={mode}
              setMode={setMode}
              onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onNavigateHome={() => setView('landing')}
            />

            {/* Messages Scroll Area */}
            <div className="chat-messages-container">
              {error && (
                <div
                  style={{
                    margin: '16px auto',
                    maxWidth: '800px',
                    width: '90%',
                    padding: '12px 18px',
                    background: 'rgba(224, 35, 28, 0.15)',
                    border: '1px solid rgba(224, 35, 28, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fca5a5',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: "'Onest', sans-serif",
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fca5a5',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      marginLeft: '12px',
                    }}
                    title="Dismiss alert"
                  >
                    ✕
                  </button>
                </div>
              )}

              {messages.length === 0 ? (
                <QuickPrompts
                  onSelectPrompt={handleSelectPrompt}
                  mode={mode}
                  setMode={setMode}
                />
              ) : (
                <div className="messages-inner">
                  {messages.map((msg, idx) => (
                    <ChatMessage
                      key={msg._id || idx}
                      message={msg}
                      onFeedbackClick={handleFeedbackClick}
                      onSpeak={speakText}
                      isSpeaking={isSpeaking}
                      onToggleMode={toggleMessageMode}
                    />
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="typing-indicator-wrapper" style={{ borderColor: 'rgba(224, 35, 28, 0.2)', background: '#0f131c' }}>
                      <div className="typing-dots">
                        <div className="typing-dot" style={{ background: '#e0231c' }} />
                        <div className="typing-dot" style={{ background: '#e0231c' }} />
                        <div className="typing-dot" style={{ background: '#e0231c' }} />
                      </div>
                      <span className="typing-text" style={{ fontFamily: "'Onest', sans-serif" }}>
                        EasyAssist AI is formulating {mode === 'simple' ? 'a simple explanation...' : 'an elaborate breakdown...'}
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <ChatInput
              input={inputText}
              setInput={setInputText}
              onSend={() => handleSendMessage()}
              isLoading={isLoading}
              isListening={isListening}
              onToggleMic={toggleListening}
              speechSupported={speechSupported}
              mode={mode}
              setMode={setMode}
            />
          </main>
        </div>
      )}

      {/* ===================== SYSTEM MODALS ===================== */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetCompleted={refreshChats}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={submitFeedback}
        initialRating={feedbackInitialRating}
        messageId={feedbackMessageId}
      />
    </div>
  );
}
