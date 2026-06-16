import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function scoreColor(score) {
  if (score >= 8) return '#2d6a4f';
  if (score >= 6) return '#52b788';
  if (score >= 4) return '#f6ad55';
  return '#fc8181';
}

function ScoreBadge(props) {
  var score = props.score;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: scoreColor(score),
      color: 'white',
      fontWeight: '700',
      fontSize: '15px',
      flexShrink: 0
    }}>
      {score}
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '48px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
      <p style={{ color: '#4a5568', fontWeight: '500' }}>Searching grants and scoring with Claude...</p>
      <p style={{ color: '#a0aec0', fontSize: '13px', marginTop: '6px' }}>This usually takes 10-20 seconds</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '48px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
      <p style={{ color: '#4a5568', fontWeight: '500' }}>No grants found for that category.</p>
      <p style={{ color: '#a0aec0', fontSize: '13px', marginTop: '6px' }}>Try a different focus area.</p>
    </div>
  );
}

function GrantCard(props) {
  var grant = props.grant;
  var isExpanded = props.isExpanded;
  var onToggle = props.onToggle;

  var cardStyle = {
    border: '1.5px solid',
    borderColor: isExpanded ? '#2d6a4f' : '#e2e8f0',
    borderRadius: '10px',
    padding: '14px 16px',
    cursor: 'pointer',
    boxShadow: isExpanded ? '0 0 0 3px rgba(45,106,79,0.1)' : 'none'
  };

  var headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  var titleStyle = {
    fontWeight: '600',
    fontSize: '14px',
    color: '#1a202c',
    marginBottom: '2px'
  };

  var metaStyle = {
    fontSize: '12px',
    color: '#718096'
  };

  var bodyStyle = {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f0f4f8'
  };

  var claudeBoxStyle = {
    background: '#f0fdf4',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2d6a4f',
    marginBottom: '10px'
  };

  var linkStyle = {
    display: 'inline-block',
    padding: '6px 14px',
    background: '#2d6a4f',
    color: 'white',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    textDecoration: 'none'
  };

  return (
    <div onClick={onToggle} style={cardStyle}>
      <div style={headerStyle}>
        <ScoreBadge score={grant.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>{grant.title}</div>
          <div style={metaStyle}>{grant.agency} · Deadline: {grant.deadline} · {grant.amount}</div>
        </div>
        <span style={{ fontSize: '12px', color: '#a0aec0' }}>{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div style={bodyStyle}>
          <p style={{ fontSize: '13px', color: '#4a5568', marginBottom: '8px' }}>{grant.description}</p>
          <div style={claudeBoxStyle}>
            <strong>Claude's take:</strong> {grant.reason}
          </div>
          <a
            href={grant.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={function(e) { e.stopPropagation(); }}
            style={linkStyle}
          >
            View on Grants.gov →
          </a>
        </div>
      )}
    </div>
  );
}

function ChartSection(props) {
  var chartData = props.chartData;
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#2d6a4f', marginBottom: '16px' }}>
        Mission Alignment Scores
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
          <Tooltip
            formatter={function(value) { return [value + '/10', 'Alignment Score']; }}
            contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {chartData.map(function(entry, index) {
              return <Cell key={index} fill={scoreColor(entry.score)} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GrantList(props) {
  var grants = props.grants;
  var sorted = props.sorted;
  var sortBy = props.sortBy;
  var setSortBy = props.setSortBy;
  var expandedId = props.expandedId;
  var setExpandedId = props.setExpandedId;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#2d6a4f' }}>
          {grants.length} Grants Found
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#718096' }}>Sort by:</span>
          {['score', 'deadline'].map(function(opt) {
            return (
              <button
                key={opt}
                onClick={function() { setSortBy(opt); }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: '1.5px solid',
                  borderColor: sortBy === opt ? '#2d6a4f' : '#e2e8f0',
                  background: sortBy === opt ? '#2d6a4f' : 'white',
                  color: sortBy === opt ? 'white' : '#4a5568',
                  cursor: 'pointer',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map(function(grant) {
          return (
            <GrantCard
              key={grant.id}
              grant={grant}
              isExpanded={expandedId === grant.id}
              onToggle={function() {
                setExpandedId(expandedId === grant.id ? null : grant.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard(props) {
  var grants = props.grants;
  var loading = props.loading;
  var [sortBy, setSortBy] = useState('score');
  var [expandedId, setExpandedId] = useState(null);

  if (loading) { return <LoadingState />; }
  if (grants.length === 0) { return <EmptyState />; }

  var sorted = grants.slice().sort(function(a, b) {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'deadline') return (a.deadline || '').localeCompare(b.deadline || '');
    return 0;
  });

  var chartData = grants
    .slice()
    .sort(function(a, b) { return b.score - a.score; })
    .slice(0, 8)
    .map(function(g) {
      return {
        name: g.title.length > 22 ? g.title.slice(0, 22) + '...' : g.title,
        score: g.score
      };
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ChartSection chartData={chartData} />
      <GrantList
        grants={grants}
        sorted={sorted}
        sortBy={sortBy}
        setSortBy={setSortBy}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    </div>
  );
}
