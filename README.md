# 🌱 Grant-Match
### AI-powered grant discovery and scoring for nonprofits

**Live App:** https://grant-match-eight.vercel.app/

---

## What It Does

Nonprofits waste enormous time manually researching grants. Grant-Match lets a nonprofit staff member describe their organization's mission, and the app automatically finds matching grant opportunities, scores each one for mission alignment using Claude AI, and displays everything in an interactive dashboard — with an AI advisor chatbot on the side.

**Full flow:**
1. User enters their nonprofit's mission, focus area, and location
2. App retrieves relevant grant opportunities
3. Claude AI analyzes each grant and scores it 1–10 for mission alignment, with a one-sentence reason
4. Results are cleaned and structured into a sortable dashboard
5. A bar chart visualizes alignment scores at a glance
6. A Claude-powered chatbot answers follow-up questions like *"Which should I apply to first?"* or *"Help me write a pitch for this grant"*

---

## Features

- **AI Grant Scoring** — Claude evaluates each grant against the org's mission and returns a score + reason
- **Interactive Dashboard** — sortable by alignment score or deadline, expandable grant cards
- **Data Visualization** — bar chart of mission alignment scores using Recharts
- **Grant Advisor Chatbot** — Claude-powered chat with suggested questions and full grant context
- **Clean, accessible UI** — usable by nonprofit staff with no technical background

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| AI Layer | Claude API (claude-sonnet-4-6) |
| Charts | Recharts |
| Hosting | Vercel |

---

## How to Run Locally

```bash
git clone https://github.com/RanveerTC/grant-match.git
cd grant-match
npm install
```

Create a `.env` file in the root:
```
REACT_APP_ANTHROPIC_API_KEY=your_key_here
```

Then:
```bash
npm start
```

---

## Why I Built This

This project was built as part of my application to the Claude Corps Fellowship. Claude Corps places fellows inside nonprofits to build AI tools that create real impact. Grant-Match targets a genuine pain point — nonprofit staff spending hours manually searching for funding — and solves it with a tool that requires no technical knowledge to use.

---

## What's Next

- Connect to live grants APIs (Grants.gov, Candid/Foundation Directory)
- Add grant deadline reminders
- Export results to CSV for sharing with teams
- User accounts to save and track grant applications
