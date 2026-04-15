import React from 'react';

const categories = ["Admissions", "Courses", "Hostel", "Facilities", "Events"];

const QuickButtons = ({ onSelect }) => {
  return (
    <div className="quick-buttons-container">
      {categories.map((cat) => (
        <button 
          key={cat} 
          className="quick-btn" 
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default QuickButtons;
