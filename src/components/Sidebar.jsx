import React from 'react';

const Sidebar = () => {
  const navItems = [
    { name: 'Assistant', icon: '💬', active: true },
    { name: 'Admissions', icon: '🎓' },
    { name: 'Hostels', icon: '🏠' },
    { name: 'Courses', icon: '📚' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <h1>Academia</h1>
        <p>AI Assistant</p>
      </div>

      <button className="new-chat-btn">
        New Chat
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.name} className={`nav-item ${item.active ? 'active' : ''}`}>
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="user-profile">
        <div className="user-avatar">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="User" 
            style={{ width: '32px' }}
          />
        </div>
        <div className="user-info">
          <h4>Alex Rivera</h4>
          <p>CS Sophomore</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
