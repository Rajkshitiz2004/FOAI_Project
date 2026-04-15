import React, { useState } from 'react';

const MessageBubble = ({ message, onFeedback }) => {
  const [feedbackStatus, setFeedbackStatus] = useState(null); // 'helpful' | 'not-helpful'

  const handleFeedback = (status) => {
    if (feedbackStatus) return; // Prevent double feedback
    setFeedbackStatus(status);
    onFeedback(message.id, status);
    
    // Simulate Google Forms tracking
    const feedbackLog = JSON.parse(localStorage.getItem('faq_feedback') || '[]');
    feedbackLog.push({
      messageId: message.id,
      query: message.userQuery,
      answer: message.text,
      status: status,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('faq_feedback', JSON.stringify(feedbackLog));
  };

  const isBot = message.type === 'bot';

  return (
    <div className={`message-wrapper ${isBot ? 'bot' : 'user'} fade-in`}>
      <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
        <p>{message.text}</p>
        
        {message.options && (
          <div className="message-options">
            {message.options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => window.dispatchChatCommand(opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {message.suggestions && (
          <div className="message-suggestions">
            <span className="suggestion-label">Try asking about:</span>
            {message.suggestions.map((sug, i) => (
              <button key={i} className="suggestion-chip" onClick={() => window.dispatchChatCommand(sug)}>
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {isBot && !message.noFeedback && (
        <div className="feedback-container">
          {feedbackStatus ? (
            <span className="feedback-thanks">Thank you for your feedback!</span>
          ) : (
            <>
              <button className="feedback-btn" onClick={() => handleFeedback('helpful')} title="Helpful">
                👍
              </button>
              <button className="feedback-btn" onClick={() => handleFeedback('not-helpful')} title="Not Helpful">
                👎
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
