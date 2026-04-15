import React from 'react';

const QuickButtons = ({ onSelect }) => {
  const categories = ['Admissions', 'Hostel', 'Courses', 'Gym', 'Fees'];

  return (
    <>
      {categories.map((cat) => (
        <button 
          key={cat} 
          className="chip" 
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </>
  );
};

export default QuickButtons;
