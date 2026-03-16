"use client";
import { useState, useEffect } from "react";

const colleges = [
  { id: "mbu", name: "Mohan Babu University", short: "MBU", location: "Tirupati, Andhra Pradesh", status: "active", departments: 6, papers: 240, est: "1998" },
  { id: "coming2", name: "Coming Soon", short: "?", location: "More universities being added", status: "soon", departments: 0, papers: 0, est: "" },
  { id: "coming3", name: "Coming Soon", short: "?", location: "More universities being added", status: "soon", departments: 0, papers: 0, est: "" },
];

const departments = [
  { id: "cse", name: "Computer Science & Engineering", short: "CSE", subjects: 24, color: "#38bdf8", bg: "rgba(56,189,248,0.08)" },
  { id: "cse-ai", name: "CSE — Artificial Intelligence", short: "CSE-AI", subjects: 18, color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  { id: "cse-ds", name: "CSE — Data Science", short: "CSE-DS", subjects: 16, color: "#34d399", bg: "rgba(52,211,153,0.08)" },
  { id: "cse-cs", name: "CSE — Cyber Security", short: "CSE-CS", subjects: 14, color: "#fb923c", bg: "rgba(251,146,60,0.08)" },
  { id: "ece", name: "Electronics & Communication", short: "ECE", subjects: 20, color: "#f472b6", bg: "rgba(244,114,182,0.08)" },
  { id: "mech", name: "Mechanical Engineering", short: "MECH", subjects: 22, color: "#facc15", bg: "rgba(250,204,21,0.08)" },
];

const subjects: Record<string, { id: string; name: string; sem: string; papers: string[] }[]> = {
  cse: [
    { id: "ds", name: "Data Structures", sem: "3", papers: ["2024", "2023", "2022", "2021"] },
    { id: "os", name: "Operating Systems", sem: "4", papers: ["2024", "2023", "2022"] },
    { id: "dbms", name: "Database Management Systems", sem: "4", papers: ["2024", "2023", "2022", "2021"] },
    { id: "cn", name: "Computer Networks", sem: "5", papers: ["2024", "2023", "2022"] },
    { id: "se", name: "Software Engineering", sem: "5", papers: ["2024", "2023"] },
    { id: "toc", name: "Theory of Computation", sem: "5", papers: ["2024", "2023", "2022"] },
  ],
};

const pendingUploads = [
  { id: 1, subject: "Data Structures", year: "2024", uploader: "student_raj@mbu.edu", time: "2 hrs ago" },
  { id: 2, subject: "DBMS", year: "2023", uploader: "anon_upload", time: "5 hrs ago" },
];
const recentActivity = [
  { action: "Paper approved", detail: "OS 2024 — by Admin", time: "1 hr ago", type: "success" },
  { action: "New upload", detail: "CN 2022 pending review", time: "3 hrs ago", type: "warning" },
  { action: "Department added", detail: "CSE-AI activated", time: "Yesterday", type: "info" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #060912; --bg2: #0a0f1e; --surface: rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.07); --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14); --accent: #38bdf8; --accent2: #818cf8;
    --accent3: #34d399; --text: #f0f4ff; --text2: #94a3b8; --text3: #475569;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
  .bg-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; animation: float 8s ease-in-out infinite; }
  .orb1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%); top: -200px; left: -100px; }
  .orb2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(129,140,248,0.25), transparent 70%); top: 200px; right: -150px; animation-delay: 3s; }
  .orb3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(52,211,153,0.2), transparent 70%); bottom: 100px; left: 30%; animation-delay: 6s; }
  @keyframes float { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .nav { display:flex; align-items:center; justify-content:space-between; padding:0 48px; height:68px; background:rgba(6,9,18,0.8); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; }
  .nav-logo { font-family:'Plus Jakarta Sans',sans-serif; font-size:1.2rem; font-weight:800; display:flex; align-items:center; gap:10px; cursor:pointer; }
  .nav-logo-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:900; color:#000; }
  .nav-logo-text { background:linear-gradient(135deg,#fff,var(--text2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .nav-links { display:flex; gap:8px; align-items:center; }
  .nav-link { color:var(--text2); font-size:0.85rem; font-weight:500; cursor:pointer; background:none; border:none; font-family:'Plus Jakarta Sans',sans-serif; padding:7px 16px; border-radius:8px; transition:all .2s; }
  .nav-link:hover { color:var(--text); background:var(--surface2); }
  .nav-btn { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#000; padding:8px 20px; border-radius:9px; font-size:0.82rem; font-weight:700; cursor:pointer; border:none; font-family:'Plus Jakarta Sans',sans-serif; transition:all .25s; box-shadow:0 0 20px rgba(56,189,248,0.3); }
  .nav-btn:hover { transform:translateY(-1px); box-shadow:0 0 30px rgba(56,189,248,0.5); }
  .hero { position:relative; z-index:1; padding:100px 48px 80px; max-width:1000px; margin:0 auto; text-align:center; }
  .hero-badge { display:inline-flex; align-items:center; gap:8px; font-size:0.75rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.25); padding:6px 16px; border-radius:100px; margin-bottom:32px; animation:fadeUp 0.6s ease forwards; }
  .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite; }
  .hero h1 { font-size:clamp(2.8rem,6vw,5rem); font-weight:800; line-height:1.08; margin-bottom:24px; letter-spacing:-0.02em; animation:fadeUp 0.6s ease 0.1s both; }
  .hero h1 em { font-family:'Instrument Serif',serif; font-style:italic; font-weight:400; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero-sub { color:var(--text2); font-size:1.1rem; max-width:520px; margin:0 auto 52px; line-height:1.75; animation:fadeUp 0.6s ease 0.2s both; }
  .hero-stats { display:flex; gap:0; justify-content:center; background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; max-width:560px; margin:0 auto; backdrop-filter:blur(20px); animation:fadeUp 0.6s ease 0.3s both; box-shadow:0 0 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06); }
  .hero-stat { flex:1; padding:20px 16px; text-align:center; border-right:1px solid var(--border); }
  .hero-stat:last-child { border-right:none; }
  .hero-stat-num { font-size:1.6rem; font-weight:800; color:var(--accent); line-height:1; }
  .hero-stat-label { font-size:0.72rem; color:var(--text3); margin-top:4px; font-weight:500; letter-spacing:0.05em; }
  .section { position:relative; z-index:1; max-width:1140px; margin:0 auto; padding:20px 48px 80px; }
  .section-header { margin-bottom:32px; }
  .section-label { font-size:0.72rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--accent); margin-bottom:8px; }
  .section-title { font-size:1.6rem; font-weight:700; }
  .college-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }
  .college-card { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:20px; padding:32px; cursor:pointer; transition:all .3s cubic-bezier(0.4,0,0.2,1); position:relative; overflow:hidden; }
  .college-card::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:0; transition:opacity .3s; }
  .college-card:hover { border-color:var(--border2); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(56,189,248,0.1); }
  .college-card:hover::after { opacity:1; }
  .college-card.soon { opacity:0.35; cursor:default; }
  .college-card.soon:hover { transform:none; box-shadow:none; }
  .card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; }
  .college-emblem { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg,rgba(56,189,248,0.15),rgba(129,140,248,0.15)); border:1px solid rgba(56,189,248,0.2); display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:900; color:var(--accent); }
  .college-status-badge { font-size:0.65rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:4px 10px; border-radius:100px; }
  .status-active { background:rgba(52,211,153,0.12); color:var(--accent3); border:1px solid rgba(52,211,153,0.2); }
  .status-soon { background:rgba(148,163,184,0.08); color:var(--text3); border:1px solid var(--border); }
  .college-name-full { font-size:1.05rem; font-weight:700; margin-bottom:6px; }
  .college-location { font-size:0.8rem; color:var(--text2); margin-bottom:24px; }
  .college-divider { height:1px; background:var(--border); margin-bottom:18px; }
  .college-meta { display:flex; gap:24px; }
  .meta-block { display:flex; flex-direction:column; gap:2px; }
  .meta-val { font-size:1.1rem; font-weight:800; }
  .meta-key { font-size:0.7rem; color:var(--text3); font-weight:500; text-transform:uppercase; letter-spacing:0.06em; }
  .card-arrow { position:absolute; bottom:28px; right:28px; width:32px; height:32px; border-radius:8px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--text2); transition:all .25s; }
  .college-card:hover .card-arrow { background:var(--accent); border-color:var(--accent); color:#000; transform:translate(2px,-2px); }
  .breadcrumb { display:flex; gap:8px; align-items:center; font-size:0.8rem; color:var(--text3); margin-bottom:36px; }
  .bc-item { cursor:pointer; transition:color .2s; font-weight:500; }
  .bc-item:hover { color:var(--accent); }
  .bc-sep { color:var(--text3); }
  .bc-current { color:var(--text); font-weight:600; }
  .page-header { margin-bottom:40px; padding-bottom:32px; border-bottom:1px solid var(--border); }
  .page-header-label { font-size:0.72rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--accent); margin-bottom:10px; }
  .page-header h2 { font-size:clamp(1.8rem,3vw,2.6rem); font-weight:800; letter-spacing:-0.02em; margin-bottom:8px; }
  .page-header p { color:var(--text2); font-size:0.9rem; }
  .dept-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .dept-card { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:16px; padding:24px 28px; cursor:pointer; transition:all .25s; position:relative; }
  .dept-card:hover { transform:translateY(-3px); border-color:var(--border2); }
  .dept-card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .dept-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800; }
  .dept-arrow { color:var(--text3); font-size:1rem; transition:all .25s; }
  .dept-card:hover .dept-arrow { color:var(--accent); transform:translate(3px,-3px); }
  .dept-short { font-size:1.15rem; font-weight:800; margin-bottom:4px; }
  .dept-name { font-size:0.8rem; color:var(--text2); line-height:1.5; margin-bottom:16px; }
  .dept-bar { height:3px; border-radius:2px; }
  .dept-count { font-size:0.72rem; color:var(--text3); font-weight:500; margin-top:10px; }
  .subject-list { display:flex; flex-direction:column; gap:10px; }
  .subject-row { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:14px; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:all .2s; }
  .subject-row:hover { border-color:var(--border2); background:var(--surface2); transform:translateX(4px); }
  .subj-left { display:flex; flex-direction:column; gap:5px; }
  .subj-name { font-weight:600; font-size:0.95rem; }
  .subj-sem { display:inline-flex; align-items:center; font-size:0.7rem; font-weight:600; color:var(--accent); background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.15); padding:2px 8px; border-radius:100px; width:fit-content; }
  .subj-right { display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:flex-end; }
  .paper-chip { font-size:0.72rem; font-weight:600; background:var(--surface2); color:var(--text2); border:1px solid var(--border); padding:4px 12px; border-radius:8px; transition:all .2s; cursor:pointer; }
  .paper-chip:hover { background:var(--accent); color:#000; border-color:var(--accent); }
  .papers-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
  .paper-card { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:16px; padding:32px 24px; text-align:center; cursor:pointer; transition:all .25s; position:relative; overflow:hidden; }
  .paper-card::before { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--accent),var(--accent2)); transform:scaleX(0); transition:transform .3s; }
  .paper-card:hover { border-color:rgba(56,189,248,0.3); transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.3); }
  .paper-card:hover::before { transform:scaleX(1); }
  .paper-icon { font-size:2rem; margin-bottom:14px; }
  .paper-year { font-size:2rem; font-weight:800; margin-bottom:6px; letter-spacing:-0.02em; }
  .paper-type { font-size:0.72rem; color:var(--text3); font-weight:500; margin-bottom:20px; }
  .paper-open-btn { display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:700; color:var(--accent); background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.2); padding:6px 16px; border-radius:8px; transition:all .2s; }
  .paper-card:hover .paper-open-btn { background:var(--accent); color:#000; }
  .admin-layout { display:grid; grid-template-columns:240px 1fr; min-height:100vh; }
  .admin-sidebar { background:rgba(6,9,18,0.95); backdrop-filter:blur(20px); border-right:1px solid var(--border); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; }
  .sidebar-top { padding:28px 24px; border-bottom:1px solid var(--border); }
  .sidebar-brand { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
  .sidebar-brand-icon { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:900; color:#000; }
  .sidebar-brand-name { font-weight:800; font-size:0.95rem; }
  .sidebar-univ { font-size:0.72rem; color:var(--text3); margin-top:4px; }
  .sidebar-nav { padding:16px 12px; flex:1; }
  .sidebar-section-label { font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--text3); padding:8px 12px; margin-bottom:4px; }
  .sidebar-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; font-size:0.84rem; color:var(--text2); cursor:pointer; transition:all .2s; margin-bottom:2px; font-weight:500; }
  .sidebar-item:hover { color:var(--text); background:var(--surface2); }
  .sidebar-item.active { color:var(--accent); background:rgba(56,189,248,0.1); font-weight:600; }
  .sidebar-item .s-icon { width:20px; text-align:center; }
  .sidebar-badge { margin-left:auto; background:#ef4444; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 7px; border-radius:100px; }
  .sidebar-bottom { padding:16px 12px; border-top:1px solid var(--border); }
  .admin-main { padding:40px 48px; overflow-y:auto; background:var(--bg2); }
  .admin-page-header { margin-bottom:36px; }
  .admin-page-header h2 { font-size:1.6rem; font-weight:800; letter-spacing:-0.02em; margin-bottom:4px; }
  .admin-page-header p { color:var(--text2); font-size:0.85rem; }
  .admin-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .admin-stat-card { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:14px; padding:22px; transition:all .2s; }
  .admin-stat-card:hover { border-color:var(--border2); }
  .admin-stat-icon { font-size:1.2rem; margin-bottom:12px; }
  .admin-stat-num { font-size:1.8rem; font-weight:800; margin-bottom:4px; letter-spacing:-0.02em; }
  .admin-stat-label { font-size:0.75rem; color:var(--text3); font-weight:500; }
  .admin-stat-trend { font-size:0.72rem; color:var(--accent3); margin-top:6px; font-weight:600; }
  .admin-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .admin-panel { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:16px; padding:24px; }
  .panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .panel-title { font-size:0.85rem; font-weight:700; }
  .panel-badge { background:#ef4444; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:100px; }
  .panel-badge-blue { background:rgba(56,189,248,0.15); color:var(--accent); font-size:0.65rem; font-weight:700; padding:2px 8px; border-radius:100px; border:1px solid rgba(56,189,248,0.2); }
  .pending-item { padding:14px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; }
  .pending-item:last-child { border-bottom:none; }
  .pending-dot { width:8px; height:8px; border-radius:50%; background:#f59e0b; flex-shrink:0; }
  .pending-info { flex:1; }
  .pending-subject { font-size:0.88rem; font-weight:600; margin-bottom:3px; }
  .pending-meta { font-size:0.72rem; color:var(--text3); }
  .pending-actions { display:flex; gap:8px; }
  .btn-approve { background:rgba(52,211,153,0.15); color:var(--accent3); border:1px solid rgba(52,211,153,0.25); padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .2s; }
  .btn-approve:hover { background:var(--accent3); color:#000; }
  .btn-reject { background:rgba(239,68,68,0.08); color:#f87171; border:1px solid rgba(239,68,68,0.2); padding:6px 14px; border-radius:8px; font-size:0.75rem; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .2s; }
  .btn-reject:hover { background:#ef4444; color:#fff; }
  .activity-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); align-items:flex-start; }
  .activity-item:last-child { border-bottom:none; }
  .act-dot-wrap { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .act-success { background:rgba(52,211,153,0.1); }
  .act-warning { background:rgba(245,158,11,0.1); }
  .act-info { background:rgba(56,189,248,0.1); }
  .act-action { font-size:0.85rem; font-weight:600; margin-bottom:2px; }
  .act-detail { font-size:0.75rem; color:var(--text3); }
  .act-time { font-size:0.7rem; color:var(--text3); margin-left:auto; white-space:nowrap; }
  .upload-form { background:var(--surface); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:16px; padding:32px; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
  .form-group { display:flex; flex-direction:column; gap:8px; }
  .form-label { font-size:0.75rem; color:var(--text2); font-weight:600; letter-spacing:0.06em; text-transform:uppercase; }
  .form-select,.form-input { background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text); padding:11px 14px; border-radius:10px; font-size:0.88rem; font-family:'Plus Jakarta Sans',sans-serif; outline:none; transition:all .2s; }
  .form-select:focus,.form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(56,189,248,0.1); }
  .drop-zone { border:2px dashed var(--border2); border-radius:14px; padding:48px 24px; text-align:center; cursor:pointer; transition:all .25s; margin-bottom:16px; background:rgba(255,255,255,0.02); }
  .drop-zone:hover { border-color:var(--accent); background:rgba(56,189,248,0.04); }
  .drop-icon { font-size:2.5rem; margin-bottom:12px; }
  .drop-title { font-size:0.95rem; font-weight:600; margin-bottom:6px; }
  .drop-sub { font-size:0.78rem; color:var(--text3); }
  .drop-sub span { color:var(--accent); font-weight:600; }
  .btn-submit { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#000; border:none; padding:13px 28px; border-radius:10px; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; width:100%; transition:all .25s; box-shadow:0 4px 20px rgba(56,189,248,0.25); }
  .btn-submit:hover { transform:translateY(-1px); box-shadow:0 8px 30px rgba(56,189,248,0.4); }
  .back-btn { display:inline-flex; align-items:center; gap:8px; color:var(--text2); font-size:0.82rem; font-weight:500; cursor:pointer; background:var(--surface); border:1px solid var(--border); padding:8px 16px; border-radius:9px; font-family:'Plus Jakarta Sans',sans-serif; transition:all .2s; width:100%; justify-content:center; }
  .back-btn:hover { color:var(--text); border-color:var(--border2); }
  .coming-soon { text-align:center; padding:80px 40px; color:var(--text3); }
  .coming-soon-icon { font-size:3rem; margin-bottom:16px; }
  .coming-soon h3 { font-size:1.1rem; font-weight:700; color:var(--text2); margin-bottom:8px; }
`;

function Nav({ setView }: { setView: (v: string) => void }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setView("home")}>
        <div className="nav-logo-icon">P</div>
        <span className="nav-logo-text">PYQHub</span>
      </div>
      <div className="nav-links">
        <button className="nav-link" onClick={() => setView("home")}>Universities</button>
        <button className="nav-link">About</button>
        <button className="nav-btn" onClick={() => setView("admin")}>Admin Panel</button>
      </div>
    </nav>
  );
}

function HomePage({ setView, setCollege }: any) {
  useEffect(() => {}, []);
  return (
    <div>
      <div className="bg-orbs"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div>
      <div className="hero">
        <div className="hero-badge"><div className="hero-badge-dot"/>Free Access · No Login Required</div>
        <h1>Your University<br/><em>Question Papers,</em><br/>One Click Away</h1>
        <p className="hero-sub">Browse past exam papers by department, subject, and year. Built for MBU students, expanding to more universities.</p>
        <div className="hero-stats">
          {[["1","University"],["6","Departments"],["240+","Papers"],["Free","Always"]].map(([n,l])=>(
            <div key={l} className="hero-stat"><div className="hero-stat-num">{n}</div><div className="hero-stat-label">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-header">
          <div className="section-label">Select University</div>
          <div className="section-title">Choose your institution</div>
        </div>
        <div className="college-grid">
          {colleges.map(c=>(
            <div key={c.id} className={`college-card ${c.status}`} onClick={()=>{if(c.status==="active"){setCollege(c);setView("college");}}}>
              <div className="card-top">
                <div className="college-emblem">{c.short}</div>
                <div className={`college-status-badge ${c.status==="active"?"status-active":"status-soon"}`}>{c.status==="active"?"● Active":"Coming Soon"}</div>
              </div>
              <div className="college-name-full">{c.name}</div>
              <div className="college-location">📍 {c.location}</div>
              {c.status==="active"&&(<>
                <div className="college-divider"/>
                <div className="college-meta">
                  <div className="meta-block"><div className="meta-val">{c.departments}</div><div className="meta-key">Departments</div></div>
                  <div className="meta-block"><div className="meta-val">{c.papers}+</div><div className="meta-key">Papers</div></div>
                  <div className="meta-block"><div className="meta-val">{c.est}</div><div className="meta-key">Est.</div></div>
                </div>
                <div className="card-arrow">→</div>
              </>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CollegePage({college,setView,setDept}:any){
  return(
    <div>
      <div className="bg-orbs"><div className="orb orb1"/><div className="orb orb2"/></div>
      <div className="section" style={{paddingTop:48}}>
        <div className="breadcrumb">
          <span className="bc-item" onClick={()=>setView("home")}>🏠 Universities</span>
          <span className="bc-sep">›</span><span className="bc-current">{college.short}</span>
        </div>
        <div className="page-header">
          <div className="page-header-label">{college.name}</div>
          <h2>Select Department</h2>
          <p>{college.location} · {college.departments} Departments · {college.papers}+ Papers</p>
        </div>
        <div className="dept-grid">
          {departments.map(d=>(
            <div key={d.id} className="dept-card"
              onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 8px 30px ${d.color}22`)}
              onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}
              onClick={()=>{setDept(d);setView("subjects");}}>
              <div className="dept-card-top">
                <div className="dept-icon" style={{background:d.bg,color:d.color}}>{d.short.slice(0,2)}</div>
                <div className="dept-arrow">↗</div>
              </div>
              <div className="dept-short" style={{color:d.color}}>{d.short}</div>
              <div className="dept-name">{d.name}</div>
              <div className="dept-bar" style={{background:`linear-gradient(90deg,${d.color},transparent)`}}/>
              <div className="dept-count">{d.subjects} subjects available</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectsPage({college,dept,setView,setSubject}:any){
  const list=subjects[dept.id]||subjects["cse"];
  return(
    <div>
      <div className="bg-orbs"><div className="orb orb1"/></div>
      <div className="section" style={{paddingTop:48}}>
        <div className="breadcrumb">
          <span className="bc-item" onClick={()=>setView("home")}>🏠 Universities</span>
          <span className="bc-sep">›</span>
          <span className="bc-item" onClick={()=>setView("college")}>{college.short}</span>
          <span className="bc-sep">›</span><span className="bc-current">{dept.short}</span>
        </div>
        <div className="page-header">
          <div className="page-header-label" style={{color:dept.color}}>{dept.short}</div>
          <h2>{dept.name}</h2>
          <p>Select a subject to view available question papers</p>
        </div>
        <div className="subject-list">
          {list.map(s=>(
            <div key={s.id} className="subject-row" onClick={()=>{setSubject(s);setView("papers");}}>
              <div className="subj-left">
                <div className="subj-name">{s.name}</div>
                <div className="subj-sem">Semester {s.sem}</div>
              </div>
              <div className="subj-right">
                {s.papers.map(y=><span key={y} className="paper-chip" onClick={e=>e.stopPropagation()}>{y}</span>)}
                <span style={{color:"var(--text3)",fontSize:"1rem",marginLeft:4}}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PapersPage({college,dept,subject,setView}:any){
  return(
    <div>
      <div className="bg-orbs"><div className="orb orb1"/><div className="orb orb2"/></div>
      <div className="section" style={{paddingTop:48}}>
        <div className="breadcrumb">
          <span className="bc-item" onClick={()=>setView("home")}>🏠 Universities</span>
          <span className="bc-sep">›</span>
          <span className="bc-item" onClick={()=>setView("college")}>{college.short}</span>
          <span className="bc-sep">›</span>
          <span className="bc-item" onClick={()=>setView("subjects")}>{dept.short}</span>
          <span className="bc-sep">›</span><span className="bc-current">{subject.name}</span>
        </div>
        <div className="page-header">
          <div className="page-header-label">Question Papers</div>
          <h2>{subject.name}</h2>
          <p>{dept.name} · Semester {subject.sem}</p>
        </div>
        <div className="papers-grid">
          {subject.papers.map((year:string)=>(
            <div key={year} className="paper-card" onClick={()=>alert(`📄 Opening ${subject.name} — ${year}\n\nPDF viewer opens here!`)}>
              <div className="paper-icon">📄</div>
              <div className="paper-year">{year}</div>
              <div className="paper-type">End Semester Exam</div>
              <div className="paper-open-btn">Open PDF →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPage({setView}:any){
  const [tab,setTab]=useState("dashboard");
  const [pending,setPending]=useState(pendingUploads);
  const navItems=[
    {id:"dashboard",icon:"▦",label:"Dashboard"},
    {id:"upload",icon:"⬆",label:"Upload Paper"},
    {id:"pending",icon:"⏳",label:"Pending Reviews",badge:pending.length},
    {id:"papers",icon:"📄",label:"Manage Papers"},
    {id:"departments",icon:"🏛",label:"Departments"},
    {id:"settings",icon:"⚙",label:"Settings"},
  ];
  return(
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand"><div className="sidebar-brand-icon">P</div><span className="sidebar-brand-name">PYQHub</span></div>
          <div className="sidebar-univ">Mohan Babu University</div>
        </div>
        <div className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map(item=>(
            <div key={item.id} className={`sidebar-item ${tab===item.id?"active":""}`} onClick={()=>setTab(item.id)}>
              <span className="s-icon">{item.icon}</span>{item.label}
              {item.badge?<span className="sidebar-badge">{item.badge}</span>:null}
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <button className="back-btn" onClick={()=>setView("home")}>← Back to Site</button>
        </div>
      </aside>
      <main className="admin-main">
        {tab==="dashboard"&&(<>
          <div className="admin-page-header"><h2>Dashboard</h2><p>Welcome back — here's what's happening at PYQHub MBU</p></div>
          <div className="admin-stats">
            {[{icon:"📄",num:"240",label:"Total Papers",trend:"+12 this month"},{icon:"🏛",num:"6",label:"Departments",trend:"All active"},{icon:"⏳",num:`${pending.length}`,label:"Pending Reviews",trend:"Needs attention"},{icon:"👁",num:"1.2k",label:"Views Today",trend:"+18% vs yesterday"}].map(s=>(
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-icon">{s.icon}</div>
                <div className="admin-stat-num">{s.num}</div>
                <div className="admin-stat-label">{s.label}</div>
                <div className="admin-stat-trend">{s.trend}</div>
              </div>
            ))}
          </div>
          <div className="admin-grid">
            <div className="admin-panel">
              <div className="panel-header"><div className="panel-title">Pending Approvals</div>{pending.length>0&&<span className="panel-badge">{pending.length} new</span>}</div>
              {pending.map(p=>(
                <div key={p.id} className="pending-item">
                  <div className="pending-dot"/>
                  <div className="pending-info"><div className="pending-subject">{p.subject} — {p.year}</div><div className="pending-meta">{p.uploader} · {p.time}</div></div>
                  <div className="pending-actions">
                    <button className="btn-approve" onClick={()=>setPending(prev=>prev.filter(x=>x.id!==p.id))}>✓ Approve</button>
                    <button className="btn-reject" onClick={()=>setPending(prev=>prev.filter(x=>x.id!==p.id))}>✕</button>
                  </div>
                </div>
              ))}
              {pending.length===0&&<p style={{color:"var(--text3)",fontSize:"0.85rem",textAlign:"center",padding:"20px 0"}}>✅ All clear!</p>}
            </div>
            <div className="admin-panel">
              <div className="panel-header"><div className="panel-title">Recent Activity</div><span className="panel-badge-blue">Live</span></div>
              {recentActivity.map((a,i)=>(
                <div key={i} className="activity-item">
                  <div className={`act-dot-wrap act-${a.type}`}>{a.type==="success"?"✓":a.type==="warning"?"!":"i"}</div>
                  <div style={{flex:1}}><div className="act-action">{a.action}</div><div className="act-detail">{a.detail}</div></div>
                  <div className="act-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}
        {tab==="upload"&&(<>
          <div className="admin-page-header"><h2>Upload Paper</h2><p>Add a new question paper to the platform</p></div>
          <div className="upload-form">
            <div className="form-row">
              <div className="form-group"><label className="form-label">Department</label><select className="form-select">{departments.map(d=><option key={d.id}>{d.short} — {d.name}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Subject</label><select className="form-select">{subjects.cse.map(s=><option key={s.id}>{s.name}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Year</label><select className="form-select">{["2024","2023","2022","2021","2020"].map(y=><option key={y}>{y}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Exam Type</label><select className="form-select"><option>End Semester</option><option>Mid Semester</option><option>Supplementary</option></select></div>
            </div>
            <div className="drop-zone"><div className="drop-icon">📤</div><div className="drop-title">Drop your PDF here</div><div className="drop-sub"><span>Click to browse</span> or drag and drop · PDF only · Max 20MB</div></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Start Page</label><input className="form-input" type="number" placeholder="e.g. 1"/></div>
              <div className="form-group"><label className="form-label">End Page</label><input className="form-input" type="number" placeholder="e.g. 4"/></div>
            </div>
            <button className="btn-submit" onClick={()=>alert("✅ Uploaded! (Demo)")}>Upload Paper →</button>
          </div>
        </>)}
        {tab==="pending"&&(<>
          <div className="admin-page-header"><h2>Pending Reviews</h2><p>Student submissions waiting for approval</p></div>
          <div className="admin-panel">
            <div className="panel-header"><div className="panel-title">Queue</div>{pending.length>0&&<span className="panel-badge">{pending.length} pending</span>}</div>
            {pending.map(p=>(
              <div key={p.id} className="pending-item">
                <div className="pending-dot"/>
                <div className="pending-info"><div className="pending-subject">{p.subject} — {p.year}</div><div className="pending-meta">By: {p.uploader} · {p.time}</div></div>
                <div className="pending-actions">
                  <button className="btn-approve" onClick={()=>setPending(prev=>prev.filter(x=>x.id!==p.id))}>✓ Approve</button>
                  <button className="btn-reject" onClick={()=>setPending(prev=>prev.filter(x=>x.id!==p.id))}>✕ Reject</button>
                </div>
              </div>
            ))}
            {pending.length===0&&<p style={{color:"var(--text3)",fontSize:"0.85rem",textAlign:"center",padding:"24px 0"}}>✅ No pending submissions.</p>}
          </div>
        </>)}
        {(tab==="papers"||tab==="departments"||tab==="settings")&&(
          <div className="coming-soon">
            <div className="coming-soon-icon">🚧</div>
            <h3>{tab.charAt(0).toUpperCase()+tab.slice(1)} — Coming in Phase 2</h3>
            <p>This section will be built after the prototype is complete.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("home");
  const [college,setCollege]=useState<any>(null);
  const [dept,setDept]=useState<any>(null);
  const [subject,setSubject]=useState<any>(null);
  return(<>
    <style>{css}</style>
    {view!=="admin"&&<Nav setView={setView}/>}
    {view==="home"&&<HomePage setView={setView} setCollege={setCollege}/>}
    {view==="college"&&college&&<CollegePage college={college} setView={setView} setDept={setDept}/>}
    {view==="subjects"&&college&&dept&&<SubjectsPage college={college} dept={dept} setView={setView} setSubject={setSubject}/>}
    {view==="papers"&&college&&dept&&subject&&<PapersPage college={college} dept={dept} subject={subject} setView={setView}/>}
    {view==="admin"&&<AdminPage setView={setView}/>}
  </>);
}