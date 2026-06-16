import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import './index.css';

export default function App() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missionData, setMissionData] = useState(null);
  const [searched, setSearched] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)',
        padding: '24px 32px',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
           🌱 Grant-Match
          </h1>
          <p style={{ opacity: 0.85, fontSize: '14px' }}>
            AI-powered grant discovery and scoring for nonprofits
          </p>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* Search Form */}
        <SearchForm
          setGrants={setGrants}
          setLoading={setLoading}
          setMissionData={setMissionData}
          setSearched={setSearched}
          loading={loading}
        />

        {/* Results + Chatbot */}
        {searched && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '24px',
            marginTop: '24px'
          }}>
            <Dashboard grants={grants} loading={loading} />
            <Chatbot grants={grants} missionData={missionData} />
          </div>
        )}
      </div>
    </div>
  );
}