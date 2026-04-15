import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickButtons from './QuickButtons';
import { getQueryContext } from '../logic/intentHandler';
import { getAIResponse } from '../logic/aiService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hello! I'm your Academia AI. I'm connected to the college knowledge base and ready to help!",
      type: 'bot',
      noFeedback: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Expose a command dispatcher for quick buttons and options
  useEffect(() => {
    window.dispatchChatCommand = (text) => {
      handleSendMessage(text);
    };
    return () => delete window.dispatchChatCommand;
  }, []);

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // 1. Retrieve Context from Knowledge Base
      const context = getQueryContext(text);

      // 2. Call AI Service (Hugging Face Router / Groq)
      const botResponse = await getAIResponse(text, context);
      
      const botMessage = {
        ...botResponse,
        id: (Date.now() + 1).toString(),
        userQuery: text
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my brain right now. Please try again soon!",
        type: 'bot',
        intent: 'error'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleFeedback = (id, status) => {
    console.log(`Feedback for ${id}: ${status}`);
    // State is already handled inside MessageBubble for visual feedback
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="status-indicator"></div>
        <h1>Academia AI</h1>
        <p>College FAQ Hub</p>
      </header>

      <div className="chat-history">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      <footer className="chat-footer">
        <QuickButtons onSelect={(cat) => handleSendMessage(`Tell me about ${cat}`)} />
        
        <div className="input-area">
          <input 
            type="text" 
            placeholder="Ask about admissions, fees, hostel..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-btn" onClick={() => handleSendMessage()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
