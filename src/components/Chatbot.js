import React, { useState, useRef, useEffect } from 'react';

function Message(props) {
  var msg = props.msg;
  var isUser = msg.role === 'user';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px'
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '10px 14px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? '#2d6a4f' : '#f0f4f8',
        color: isUser ? 'white' : '#1a202c',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function SuggestedQuestion(props) {
  return (
    <button
      onClick={props.onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        marginBottom: '6px',
        background: '#f0fdf4',
        border: '1px solid #c6f6d5',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#2d6a4f',
        cursor: 'pointer',
        fontWeight: '500'
      }}
    >
      {props.text}
    </button>
  );
}

export default function Chatbot(props) {
  var grants = props.grants;
  var missionData = props.missionData;

  var [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi! I am your grant advisor. Ask me anything about the grants found, or I can help you draft language for an application.'
  }]);
  var [input, setInput] = useState('');
  var [loading, setLoading] = useState(false);
  var bottomRef = useRef(null);

  var suggestions = [
    'Which grant should I apply to first?',
    'Which grants have the nearest deadlines?',
    'Help me write a one-paragraph pitch for the top grant.',
    'What are the common requirements across these grants?'
  ];

  useEffect(function() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function buildSystemPrompt() {
    var grantsText = grants.map(function(g, i) {
      return (i + 1) + '. ' + g.title + '\n   Agency: ' + g.agency + '\n   Score: ' + g.score + '/10\n   Reason: ' + g.reason + '\n   Amount: ' + g.amount + '\n   Deadline: ' + g.deadline + '\n   Description: ' + g.description;
    }).join('\n\n');

    var mission = missionData ? missionData.mission : 'Not specified';
    var category = missionData ? missionData.category : 'Not specified';
    var location = missionData ? missionData.location : 'Not specified';

    return 'You are a helpful nonprofit grant advisor. The user works for a nonprofit and has just searched for grants.\n\nOrganization Info:\n- Mission: ' + mission + '\n- Focus Area: ' + category + '\n- Location: ' + location + '\n\nGrants found (already scored by AI):\n' + grantsText + '\n\nHelp the user understand these grants, prioritize applications, and draft language. Be concise, warm, and practical. If asked to write a pitch or draft language, write it directly.';
  }

  async function sendMessage(text) {
    var userText = text || input.trim();
    if (!userText) return;

    var newMessages = messages.concat([{ role: 'user', content: userText }]);
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      var apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

      var apiMessages = newMessages.map(function(m) {
        return { role: m.role, content: m.content };
      });

      var response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: apiMessages
        })
      });

      var data = await response.json();
      var reply = data.content[0].text;

      setMessages(newMessages.concat([{ role: 'assistant', content: reply }]));
    } catch (err) {
      console.error(err);
      setMessages(newMessages.concat([{ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]));
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  var showSuggestions = messages.length <= 1 && grants.length > 0;

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      position: 'sticky',
      top: '24px'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #f0f4f8',
        background: 'linear-gradient(135deg, #2d6a4f, #1b4332)',
        borderRadius: '12px 12px 0 0'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '2px' }}>
          🤖 Grant Advisor
        </h3>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
          Powered by Claude
        </p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {messages.map(function(msg, i) {
          return <Message key={i} msg={msg} />;
        })}

        {showSuggestions && (
          <div style={{ marginTop: '12px' }}>
            <p style={{ fontSize: '11px', color: '#a0aec0', marginBottom: '8px', fontWeight: '500' }}>
              SUGGESTED QUESTIONS
            </p>
            {suggestions.map(function(q, i) {
              return (
                <SuggestedQuestion
                  key={i}
                  text={q}
                  onClick={function() { sendMessage(q); }}
                />
              );
            })}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: '14px 14px 14px 4px',
              background: '#f0f4f8',
              fontSize: '13px',
              color: '#a0aec0'
            }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #f0f4f8',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={input}
          onChange={function(e) { setInput(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder={grants.length === 0 ? 'Search for grants first...' : 'Ask about these grants...'}
          disabled={grants.length === 0 || loading}
          style={{
            flex: 1,
            padding: '9px 12px',
            border: '1.5px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            background: grants.length === 0 ? '#f9fafb' : 'white'
          }}
        />
        <button
          onClick={function() { sendMessage(); }}
          disabled={!input.trim() || loading || grants.length === 0}
          style={{
            padding: '9px 16px',
            background: (!input.trim() || loading || grants.length === 0) ? '#a0aec0' : '#2d6a4f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
