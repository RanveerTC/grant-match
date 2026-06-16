import React, { useState } from 'react';

var CATEGORY_OPTIONS = [
  'Education', 'Health', 'Environment', 'Arts & Culture',
  'Housing', 'Food Security', 'Youth Development', 'Social Services',
  'Civil Rights', 'Animal Welfare'
];

var MOCK_GRANTS = [
  {
    id: '1',
    title: 'Youth Education and Mentorship Grant',
    description: 'Supports organizations providing educational support and mentorship to underserved youth in urban communities.',
    amount: '$10,000 – $50,000',
    deadline: '2025-09-30',
    agency: 'Department of Education',
    link: 'https://www.grants.gov'
  },
  {
    id: '2',
    title: 'Community Learning Centers Program',
    description: 'Funds after-school programs that provide academic enrichment to students in low-income communities.',
    amount: '$50,000 – $200,000',
    deadline: '2025-08-15',
    agency: 'Office of Elementary Education',
    link: 'https://www.grants.gov'
  },
  {
    id: '3',
    title: '21st Century Community Learning Centers',
    description: 'Supports community learning centers that provide students with academic enrichment and safe environments.',
    amount: '$75,000 – $300,000',
    deadline: '2025-10-01',
    agency: 'Dept. of Education',
    link: 'https://www.grants.gov'
  },
  {
    id: '4',
    title: 'Promise Neighborhoods Grant',
    description: 'Supports organizations working to improve educational outcomes for children in distressed communities.',
    amount: '$25,000 – $100,000',
    deadline: '2025-11-15',
    agency: 'Dept. of Education',
    link: 'https://www.grants.gov'
  },
  {
    id: '5',
    title: 'Supporting Effective Educator Development',
    description: 'Funds programs that train and support teachers working in high-need schools and communities.',
    amount: '$40,000 – $150,000',
    deadline: '2025-07-31',
    agency: 'Office of Educator Excellence',
    link: 'https://www.grants.gov'
  },
  {
    id: '6',
    title: 'Nonprofit Capacity Building Initiative',
    description: 'Strengthens nonprofit organizations serving low-income youth by funding staff training and program development.',
    amount: '$15,000 – $60,000',
    deadline: '2025-12-01',
    agency: 'Dept. of Health and Human Services',
    link: 'https://www.grants.gov'
  },
  {
    id: '7',
    title: 'Social Innovation Fund',
    description: 'Grows the impact of innovative nonprofits with evidence-based solutions to youth development challenges.',
    amount: '$100,000 – $500,000',
    deadline: '2026-01-15',
    agency: 'Corporation for National Service',
    link: 'https://www.grants.gov'
  },
  {
    id: '8',
    title: 'Youth Workforce Development Grant',
    description: 'Funds programs providing job training, career counseling, and employment placement for at-risk youth.',
    amount: '$30,000 – $120,000',
    deadline: '2025-10-30',
    agency: 'Dept. of Labor',
    link: 'https://www.grants.gov'
  }
];

async function scoreGrantsWithClaude(grants, mission, category) {
  var apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

  var grantsText = grants.map(function(g, i) {
    return (i + 1) + '. Title: ' + g.title + '\n   Description: ' + g.description + '\n   Amount: ' + g.amount + '\n   Deadline: ' + g.deadline;
  }).join('\n\n');

  var prompt = 'You are a nonprofit grant advisor. Score each grant for mission alignment.\n\nNonprofit Mission: "' + mission + '"\nFocus Area: "' + category + '"\n\nGrants to score:\n' + grantsText + '\n\nRespond ONLY with a JSON array. No markdown, no backticks, no explanation. Just the raw JSON array.\n\nExample: [{"score": 8, "reason": "Strong alignment with education mission"}, {"score": 5, "reason": "Partial match"}]\n\nReturn exactly ' + grants.length + ' objects in the array, one per grant in order.';

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
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    var errData = await response.json();
    console.error('Claude API error:', errData);
    throw new Error('Claude API returned ' + response.status);
  }

  var data = await response.json();
  var text = data.content[0].text.trim();

  // Strip any accidental markdown backticks
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  return JSON.parse(text);
}

export default function SearchForm(props) {
  var setGrants = props.setGrants;
  var setLoading = props.setLoading;
  var setMissionData = props.setMissionData;
  var setSearched = props.setSearched;
  var loading = props.loading;

  var [mission, setMission] = useState('');
  var [category, setCategory] = useState('Education');
  var [location, setLocation] = useState('');

  async function fetchGrants() {
    if (!mission.trim()) {
      alert('Please enter your organization mission.');
      return;
    }

    setLoading(true);
    setSearched(true);
    setMissionData({ mission: mission, category: category, location: location });

    try {
      var scores = await scoreGrantsWithClaude(MOCK_GRANTS, mission, category);

      var scoredGrants = MOCK_GRANTS.map(function(g, i) {
        return Object.assign({}, g, {
          score: scores[i] ? scores[i].score : 5,
          reason: scores[i] ? scores[i].reason : 'See grant details.'
        });
      }).sort(function(a, b) { return b.score - a.score; });

      setGrants(scoredGrants);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong. Check the console for details.');
    }

    setLoading(false);
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#2d6a4f' }}>
        Tell us about your organization
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px auto', gap: '12px', alignItems: 'end' }}>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '6px' }}>
            Organization Mission *
          </label>
          <input
            type="text"
            value={mission}
            onChange={function(e) { setMission(e.target.value); }}
            placeholder="e.g. We provide after-school programs for underserved youth in urban areas"
            style={{
              width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
              borderRadius: '8px', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '6px' }}>
            Focus Area
          </label>
          <select
            value={category}
            onChange={function(e) { setCategory(e.target.value); }}
            style={{
              width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
              borderRadius: '8px', fontSize: '14px', outline: 'none',
              background: 'white', cursor: 'pointer'
            }}
          >
            {CATEGORY_OPTIONS.map(function(c) {
              return <option key={c} value={c}>{c}</option>;
            })}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '6px' }}>
            Location (optional)
          </label>
          <input
            type="text"
            value={location}
            onChange={function(e) { setLocation(e.target.value); }}
            placeholder="e.g. Texas"
            style={{
              width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
              borderRadius: '8px', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        <button
          onClick={fetchGrants}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? '#a0aec0' : 'linear-gradient(135deg, #2d6a4f, #1b4332)',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap', height: '42px'
          }}
        >
          {loading ? 'Searching...' : '🔍 Find Grants'}
        </button>

      </div>
    </div>
  );
}
