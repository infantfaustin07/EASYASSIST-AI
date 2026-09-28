import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useChat() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('simple'); // 'simple' | 'elaborate'
  const [isLoading, setIsLoading] = useState(false);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load chats list
  const loadChats = useCallback(async () => {
    try {
      setIsChatsLoading(true);
      const data = await api.getChats({ search: searchQuery });
      setChats(data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setIsChatsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load selected chat details and messages
  const selectChat = async (chatId) => {
    if (!chatId) {
      setCurrentChatId(null);
      setCurrentChat(null);
      setMessages([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getChatById(chatId);
      setCurrentChatId(chatId);
      setCurrentChat(data.chat);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new chat
  const startNewChat = () => {
    setCurrentChatId(null);
    setCurrentChat(null);
    setMessages([]);
    setError(null);
  };

  // Send message
  const sendMessage = async (content, overrideMode) => {
    if (!content || !content.trim() || isLoading) return;

    const userText = content.trim();
    const effectiveMode = overrideMode || mode;
    setError(null);

    // Optimistic user message
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
      mode: effectiveMode,
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        chatId: currentChatId,
        message: userText,
        mode: effectiveMode,
        history: messages
          .filter((m) => m && m.content)
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content })),
      });

      // Handle various response shapes gracefully
      const chatId = response.chat?._id || currentChatId || `c-${Date.now()}`;
      const chatObj = response.chat || { _id: chatId, title: userText.slice(0, 30) };
      setCurrentChatId(chatId);
      setCurrentChat(chatObj);

      const assistantMsg = response.assistantMessage || {
        _id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.data?.content || response.content || 'No response generated.',
        timestamp: new Date().toISOString(),
        mode: effectiveMode,
      };

      const userMsg = response.userMessage || tempUserMsg;

      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUserMsg._id),
        userMsg,
        assistantMsg,
      ]);

      // Refresh sidebar chats
      loadChats();
      return response;
    } catch (err) {
      const errorMsg = err.message || "I'm having trouble connecting right now. Please try again in a moment.";
      setError(errorMsg);
      // Provide an immediate assistant error reply so the user always sees a response
      const errorAssistantMsg = {
        _id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Could not generate response:** ${errorMsg}\n\n*If you are running the project locally, please verify that both the backend (\`npm run server\`) and frontend are running.*`,
        timestamp: new Date().toISOString(),
        mode: effectiveMode,
        isError: true,
      };
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUserMsg._id),
        tempUserMsg,
        errorAssistantMsg,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mode for a specific assistant message (elaborate <-> simple)
  const toggleMessageMode = async (assistantMessage) => {
    if (!assistantMessage || isLoading) return;
    const msgIndex = messages.findIndex((m) => m._id === assistantMessage._id);
    let userPrompt = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userPrompt = messages[i].content;
        break;
      }
    }
    if (!userPrompt) {
      userPrompt = 'Please explain this in more depth';
    }
    const targetMode = (assistantMessage.mode === 'elaborate' || assistantMessage.mode === 'detailed') ? 'simple' : 'elaborate';
    setMode(targetMode);
    await sendMessage(userPrompt, targetMode);
  };

  // Delete chat
  const deleteChat = async (chatId) => {
    try {
      await api.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
      return true;
    } catch (err) {
      setError('Failed to delete conversation.');
      return false;
    }
  };

  // Submit message feedback
  const submitFeedback = async (messageId, rating, comment = '') => {
    if (!currentChatId || !messageId) return;
    try {
      const result = await api.submitFeedback({
        chatId: currentChatId,
        messageId,
        rating,
        comment,
      });
      return result;
    } catch (err) {
      console.error('Feedback submission failed:', err);
    }
  };

  return {
    chats,
    currentChatId,
    currentChat,
    messages,
    mode,
    setMode,
    isLoading,
    isChatsLoading,
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
    refreshChats: loadChats,
  };
}
