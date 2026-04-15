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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      type: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const context = getQueryContext(text);
      const botResponse = await getAIResponse(text, context);
      
      const botMessage = {
        ...botResponse,
        id: (Date.now() + 1).toString(),
        userQuery: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to my brain right now. Please try again soon!",
        type: 'bot',
        intent: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  };

  return (
    <>
      <div className="chat-window">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onFeedback={handleFeedback} />
        ))}
        {isTyping && (
          <div className="msg-container bot">
             <div className="typing-neo">
                <div className="loader-blocks">
                  <div className="block"></div>
                  <div className="block"></div>
                  <div className="block"></div>
                </div>
                <span>Analyzing knowledge base...</span>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="input-container">
        <div className="quick-bar">
          <QuickButtons onSelect={(cat) => handleSendMessage(`Tell me about ${cat}`)} />
        </div>
        
        <div className="neo-input-wrapper">
          <div className="input-util-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Ask Academia AI about courses, fees, or campus life..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-action-btn" onClick={() => handleSendMessage()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <p className="input-hint">PRESS <kbd>ENTER</kbd> TO SEND MESSAGE</p>
      </footer>
    </>
  );
};

export default ChatInterface;
