import React from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
