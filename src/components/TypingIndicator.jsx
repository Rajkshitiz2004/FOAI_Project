import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="message-wrapper bot fade-in">
      <div className="message-bubble bot-bubble typing-bubble">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
