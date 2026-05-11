# Property Investment App - Project Overview

## What This App Does
A 6-stage property investment management platform for Australian investors.
Takes users from "I want to invest" → "I'm managing my portfolio"

## Core Philosophy
- SIMPLE first, advanced later
- Mobile-friendly always
- No localhost complications (pure HTML/CSS/JS)
- Progressive enhancement
- One feature at a time

## Technology Stack
- Pure HTML5
- CSS3 (Tailwind classes via inline styles for MVP)
- Vanilla JavaScript (ES6+)
- LocalStorage for data persistence
- No frameworks, no build tools, no npm

## Current Development Phase
**Phase 1: MVP** - All six stages implemented (100% feature-complete). Current focus: Sprint 7 Quality & Polish (code restructure, performance, partner income, detailed expenses, modern UI/UX) before app store release.

## AI Collaboration Rules

### Core Workflow
1. **ALWAYS** read relevant docs before coding:
   - `02-CURRENT-STATUS.md` for current progress
   - `03-STAGE-DEFINITIONS.md` for requirements
   - `04-DESIGN-SYSTEM.md` for styling
   - `05-CODE-STANDARDS.md` for patterns

2. **ALWAYS** explain what you're about to build before implementing

3. **ALWAYS** update `02-CURRENT-STATUS.md` after completing features

4. **ALWAYS** add completed features to `99-CHANGELOG.md`

### Code Quality
5. **ALWAYS** comment your code thoroughly

6. **ALWAYS** include input validation and user-friendly error messages

7. **ALWAYS** test using test cases from `03-STAGE-DEFINITIONS.md` before marking complete

8. **ALWAYS** design mobile-first (test at 375px width minimum)

### Constraints
9. **File Organization:**
   - ~~Single file (index.html) for Stage 1 & Stage 2~~ (deprecated)
   - **NEW (Sprint 7.0):** Multi-file structure for better performance and maintainability
   - css/ folder: main.css, components.css, stages.css
   - js/ folder: app.js, utils.js, stages/stage1-6.js
   - Ask before major restructuring beyond this organization

10. **NEVER** introduce frameworks without approval

11. **NEVER** refactor working code without being asked

12. **NEVER** add features not in the current sprint

13. **NEVER** create new files (docs, configs, etc.) unless explicitly requested

## The 6 Stages
1. **Financial Foundation** - Calculate borrowing capacity, equity position
2. **Market Research** - Compare suburbs with visualized data
3. **Location Intelligence** - Deep-dive into specific areas (maps, schools, etc.)
4. **Professional Network** - Connect with brokers, property managers, etc.
5. **Acquisition Tracker** - Manage purchase process
6. **Portfolio Dashboard** - Ongoing management, refinancing, equity tracking

## Development Approach
- Build Stage 1 completely before moving to Stage 2
- Test each calculation with real-world data
- Mobile-first responsive design
- Save all user data to localStorage
- No page refreshes (single-page app approach)
