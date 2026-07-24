Implementation Plan - RotinaActivity Ultimate
RotinaActivity is a premium, offline-first, high-performance personal activity and productivity tracking system inspired by ActivityWatch but featuring a Linear/Notion/Raycast-grade modern UI, integrated AI Productivity Coach (local Ollama & Cloud LLM), Forensic Timeline Replay, Privacy Audit Center, Focus Mode, System Hardware Monitoring, 360° Productivity Score, Zero-Knowledge Vault, Visual IF/THEN Automation Engine, System Tray Agent, and an automated PowerShell build (build.ps1) & Inno Setup (setup.iss) diagnostic pipeline.

User Review Required
IMPORTANT

Technology Stack: .NET 8 C# (WPF + WebView2 + React 18 / TypeScript / Tailwind CSS / Framer Motion / Recharts / Lucide Icons) combining Windows Win32 API background activity monitoring, Win32 idle hooks (GetLastInputInfo), CPU/RAM hardware counters, System Tray Agent (RotinaActivityAgent), SQLite local database (Microsoft.Data.Sqlite), REST/WebSocket server, and AES-256 encryption.
Build & Diagnostics: build.ps1 compiles the solution into single-file portable EXEs (RotinaActivity.exe and RotinaActivityAgent.exe), runs Inno Setup (setup.iss), outputs logs to build.txt, handles global exceptions via log.txt, and embeds the root application icon into all binaries and installer packages.
Privacy First: Local SQLite storage by default, zero mandatory cloud telemetry, zero-knowledge local encrypted backup vault, and full privacy controls (incognito detection, regex title masking, private hours).
Key Components to Implement
System Tray Agent (RotinaActivityAgent):

Background Windows process listening to active window title (GetForegroundWindow, GetWindowText), process name (GetWindowThreadProcessId), browser tab title, idle time (GetLastInputInfo), CPU/RAM/GPU usage.
Tray icon with quick actions (Pause Tracking, Focus Mode toggle, Open Dashboard, Status summary).
Real-time event publisher feeding the local SQLite database and WebSocket server.
Core Desktop App & Backend (RotinaActivity):

.NET 8 WPF Host with embedded Chromium WebView2 and local Kestrel REST & WebSocket API.
Global Exception Handler attaching to AppDomain.CurrentDomain.UnhandledException and TaskScheduler.UnobservedTaskException to record structured logs to log.txt (timestamp, error type, message, stack trace, error code).
SQLite Database engine (rotina_activity.db) with tables for activities, categories, projects, clients, goals, automation_rules, focus_sessions, privacy_rules, and ai_insights.
SQLite to optional PostgreSQL migration/export adapter.
Zero-Knowledge AES-256 Encryption Vault for encrypted local backups.
Modern Web UI (React + TypeScript + Tailwind CSS):

Linear / Notion / Raycast / Arc Aesthetics: Dark/Light mode, glassmorphism, accent colors, smooth Framer Motion transitions, command palette (Ctrl+K).
Modular Dashboard: Drag-and-drop customizable widgets, interactive charts (Bar, Line, Pie, Radar, Area, Heatmap, Sankey, Treemap, Timeline).
10 Core UI & Functional Highlights:
Dashboard 360°: Real-time overview of active session, productivity score (0-100), top apps/sites, context switches, work/break ratio.
Forensic Timeline & Replay: Minute-by-minute scrubber with filterable activity sequences and context switch markers.
AI Productivity Coach: Chat & insight interface supporting local Ollama models and Cloud LLMs (OpenAI) with natural language queries, pattern detection, burnout warnings, and customized daily/weekly improvement plans.
Privacy Audit Center: Granular site/app exclusions, incognito auto-pause, regex title obfuscation, instant tracking pause, and complete data wipe capabilities.
Focus Mode & Deep Work: Adaptive Pomodoro, distraction site blocker, focus recovery score, and notification dampening.
Visual IF/THEN Automation Engine: Node/rule builder triggering actions (e.g. IF process == "Code.exe" THEN assign Project "RotinaActivity", enable Focus Mode).
System Hardware Performance Monitor: CPU, RAM, disk, network, power usage correlated with productivity.
Workspaces, Projects & Clients: Billable/non-billable time allocation, client rates, hourly earnings estimates.
Goals & Gamification: Daily/weekly focus targets, streak counters, level progression, unlockable achievement badges.
Reports & Exporter: Multi-format exporter (PDF, Excel/CSV, JSON, Markdown) with visual graphs and AI summary paragraphs.
Automated Build & Setup Pipeline:

build.ps1:
Converts root icon.png to icon.ico and embeds into binaries.
Compiles RotinaActivity.exe and RotinaActivityAgent.exe as self-contained single-file win-x64 EXEs.
Packages portable outputs into publish_portable/.
Invokes Inno Setup (ISCC.exe) with setup.iss to produce Output/RotinaActivity_Setup.exe.
Directs all output, warnings, errors, and exit codes to build.txt.
Verifies presence of portable EXE, setup installer EXE, build.txt, and logging mechanism in log.txt.
setup.iss:
Inno Setup installer script installing main application, tray agent, icons, documentation, and optional desktop/start menu shortcuts.
Proposed Changes
Root Directory
[NEW] 
build.ps1
PowerShell script automating building portable EXE, running Inno Setup, logging to build.txt, verifying binaries and log.txt.

[NEW] 
setup.iss
Inno Setup 6 installer script for packaging RotinaActivity and its Tray Agent.

[NEW] 
icon.png
 & 
icon.ico
Application icon for app, tray agent, and installer.

Backend & Desktop (.NET 8 Solution)
[NEW] 
RotinaActivity.sln
Visual Studio / .NET 8 solution containing main application and tray agent projects.

[NEW] 
src/RotinaActivity/RotinaActivity.csproj
Main WPF + WebView2 application project configured for single-file self-contained win-x64 publishing.

[NEW] 
src/RotinaActivity/App.xaml.cs
Application entry point configuring global exception handlers writing to log.txt (appending timestamp, exception type, message, stack trace, error code).

[NEW] 
src/RotinaActivity/MainWindow.xaml.cs
Host window configuring WebView2 control, local REST/WebSocket server, system tray integration, and native C# bridge.

[NEW] 
src/RotinaActivity/Services/ActivityTracker.cs
Win32 native API activity monitor tracking active window, executable name, browser URL, idle time (GetLastInputInfo), CPU/RAM usage, and storing to SQLite database.

[NEW] 
src/RotinaActivity/Services/DatabaseService.cs
SQLite database engine with zero-knowledge encryption vault capabilities, schema migrations, and optional PostgreSQL export backend.

[NEW] 
src/RotinaActivity/Services/AICoachService.cs
AI Coach service supporting local Ollama endpoints and OpenAI Cloud LLM for natural language analytics, pattern detection, burnout warnings, and customized improvement plans.

[NEW] 
src/RotinaActivity/Services/AutomationEngine.cs
IF/THEN rule execution engine for context-driven triggers (app, category, time, idle status).

[NEW] 
src/RotinaActivityAgent/RotinaActivityAgent.csproj
Dedicated background System Tray Agent application.

[NEW] 
src/RotinaActivityAgent/Program.cs
System tray agent entry point running background window/idle monitoring, tray icon context menu, real-time WebSocket broadcasting, and global exception logging.

Frontend UI (React + TypeScript + Tailwind CSS)
[NEW] 
src/RotinaActivity/ui/package.json
Frontend project configuration with Vite, React, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, and Canvas-Confetti.

[NEW] 
src/RotinaActivity/ui/src/App.tsx
Main dashboard container featuring Command Palette, Dark/Light mode theme engine, Sidebar navigation, and workspace context.

[NEW] 
src/RotinaActivity/ui/src/components/Dashboard.tsx
Interactive modular dashboard with drag-and-drop widgets, 360° Productivity Score gauge, activity charts, top apps/sites, and context switch telemetry.

[NEW] 
src/RotinaActivity/ui/src/components/ForensicTimeline.tsx
Minute-by-minute visual scrubber replay timeline with context switch markers and search filters.

[NEW] 
src/RotinaActivity/ui/src/components/AICoach.tsx
AI Coach chat interface supporting natural language query prompts, Ollama/OpenAI model selection, burnout alerts, and daily AI summary reports.

[NEW] 
src/RotinaActivity/ui/src/components/PrivacyCenter.tsx
Privacy Audit Center managing incognito detection rules, title redaction filters, private hours, instant tracking pause, and Zero-Knowledge Vault password setup.

[NEW] 
src/RotinaActivity/ui/src/components/FocusMode.tsx
Deep Work Focus session manager with adaptive Pomodoro, site blocker toggles, notification control, and focus recovery score.

[NEW] 
src/RotinaActivity/ui/src/components/AutomationRules.tsx
Visual IF/THEN rule builder for custom workflow automations.

[NEW] 
src/RotinaActivity/ui/src/components/SystemMonitor.tsx
Hardware metrics monitor displaying CPU, RAM, GPU, Disk, Network, and Battery correlated with productivity levels.

[NEW] 
src/RotinaActivity/ui/src/components/GoalsGamification.tsx
Goal management system with daily/weekly targets, level progression, streaks, and unlockable achievements.

[NEW] 
src/RotinaActivity/ui/src/components/ReportsExporter.tsx
Report generator exporting formatted reports in PDF, Excel/CSV, JSON, and Markdown formats.

Verification Plan
Automated Verification
Compilation & Build Pipeline:

Run .\build.ps1 from PowerShell in c:\Users\alll\Documents\RotinaActivity.
Verify that publish_portable\RotinaActivity.exe and publish_portable\RotinaActivityAgent.exe are generated cleanly.
Verify that Output\RotinaActivity_Setup.exe is generated via Inno Setup (ISCC.exe).
Verify that build.txt contains full execution log with success indicator and zero errors.
Logging Verification:

Launch publish_portable\RotinaActivity.exe and verify that log.txt is created/appended with startup and runtime status.
Verify exception handling by testing logging capability.
Manual Verification
System Tray Agent:
Launch RotinaActivityAgent.exe, check system tray icon, test quick menu (Pause, Focus Mode, Dashboard open).
Dashboard & UI Aesthetics:
Verify Linear/Notion dark mode theme, Command Palette (Ctrl+K), animations, interactive Recharts widgets.
Forensic Timeline & AI Coach:
Test minute-by-minute scrubber and natural language AI query responses.
Privacy & Focus Mode:
Verify instant pause, sensitive title masking rules, Pomodoro focus session timer.
IF/THEN Automations & Goals:
Verify creation of new IF/THEN rules and goal badge unlocking.
