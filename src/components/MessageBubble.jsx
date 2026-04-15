import React, { useState } from 'react';

import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message, onFeedback }) => {
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const isBot = message.type === 'bot';

  const handleFeedback = (status) => {
    if (feedbackStatus) return;
    setFeedbackStatus(status);
    onFeedback(message.id, status);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    alert('Response copied to clipboard!');
  };

  if (!isBot) {
    return (
      <div className="msg-container user fade-in">
        <div className="user-text-bubble">
          {message.text}
        </div>
        <div className="msg-meta">SENT {message.timestamp || 'NOW'}</div>
      </div>
    );
  }

  // Check for specific content markers to show Rich Cards (Simulated RAG output)
  const isHostelQuery = message.userQuery?.toLowerCase().includes('hostel') || message.text.includes('hostel');

  return (
    <div className="msg-container bot fade-in">
      <div className="bot-card">
        <div className="bot-card-header">
          <div className="bot-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <span className="bot-name">Academia AI</span>
        </div>

        <div className="bot-card-body">
          <div className="bot-text">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>

          {/* Special Rich Content for Hostel/Pricing */}
          {isHostelQuery && (
            <>
              <div className="pricing-grid">
                <div className="price-box">
                  <div className="price-label">Standard Pricing</div>
                  <div className="price-value">$1,500 — $2,500</div>
                  <div className="price-sub">PER SEMESTER</div>
                </div>
                <div className="price-box accent">
                  <div className="price-label">Gym Access</div>
                  <div className="price-value">Fully Included</div>
                  <div className="price-sub">ALL RESIDENTIAL PLANS</div>
                </div>
              </div>

              <div className="callout-box">
                Note: Hostel fees range from $1,500 to $2,500 depending on the wing and room occupancy type (Single vs. Shared).
              </div>
            </>
          )}

          <div className="card-actions">
            <div className="btn-group">
              <button 
                className={`btn-icon ${feedbackStatus === 'helpful' ? 'active' : ''}`}
                onClick={() => handleFeedback('helpful')}
                style={{ background: feedbackStatus === 'helpful' ? '#ffcc00' : 'transparent' }}
              >
                👍
              </button>
              <button 
                className={`btn-icon ${feedbackStatus === 'not-helpful' ? 'active' : ''}`}
                onClick={() => handleFeedback('not-helpful')}
                style={{ background: feedbackStatus === 'not-helpful' ? '#e63b2e' : 'transparent', color: feedbackStatus === 'not-helpful' ? 'white' : 'inherit' }}
              >
                👎
              </button>
            </div>

            <button className="btn-copy" onClick={copyToClipboard}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
