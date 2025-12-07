:root{
  --bg: #f3f6fb;
  --card: #ffffff;
  --muted: #6b7280;
  --accent: #0ea5a4;
  --shadow: 0 6px 18px rgba(13,24,35,0.08);

  --color-topic: #6b7280;
  --color-lens: #14B8A6;
  --color-stakeholder: #3B82F6;
  --color-location: #22C55E;
  --color-timeframe: #F97316;
  --color-aspect: #A855F7;
  --color-blank-bg: #fff7ed;
}

*{box-sizing:border-box}
html,body{height:100%;margin:0;background:var(--bg);font-family:Helvetica,Inter,system-ui,sans-serif;color:#0f172a}
.container{display:flex;gap:20px;max-width:1100px;margin:24px auto;padding:0;width:100%}
.wizard-column, .progress-column{flex:1}
.progress-column{max-width:300px}

.input, .textarea{
  width:100%;padding:10px 12px;border:1px solid #e6eef6;background:#fff;font-size:14px;color:var(--muted);
}
.textarea{min-height:88px;resize:vertical}

.controls{margin-top:12px;display:flex;gap:8px;justify-content:flex-end}
.btn{background:#eef2ff;border:none;padding:8px 12px;border-radius:0;cursor:pointer;color:#0f172a}
.btn.primary{background:linear-gradient(90deg,#4f46e5,#06b6d4);color:#fff}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}

.guidance-card{background:#fff;padding:12px;border:1px solid #edf2ff;color:var(--muted);font-size:14px}
.stems-card{background:#fff;padding:10px;border:1px dashed #e6eef6;font-size:14px}
.report-card{background:#fff;padding:12px;border:1px solid #e6eef6}
.report-text{background:#f8fafc;padding:10px;border:1px solid #e6eef6;min-height:48px;color:var(--muted)}
.components-grid{display:grid;gap:8px;margin-top:6px}
.progress-list{display:flex;flex-direction:column;gap:8px}
.report-box{padding:4px;border:1px solid #eef2ff}

.blank {display:inline-block;padding:2px 6px;border-radius:0;background:var(--color-blank-bg);font-weight:600}
.blank.stake {background: rgba(59,130,246,0.12); color:var(--color-stakeholder); border:1px solid rgba(59,130,246,0.16)}
.blank.loc {background: rgba(34,197,94,0.12); color:var(--color-location); border:1px solid rgba(34,197,94,0.16)}
.blank.time {background: rgba(249,115,22,0.08); color:var(--color-timeframe); border:1px solid rgba(249,115,22,0.12)}
.blank.aspect{background: rgba(168,85,247,0.08); color:var(--color-aspect); border:1px solid rgba(168,85,247,0.12)}
.blank.topic {background: rgba(107,114,128,0.06); color:var(--color-topic); border:1px solid rgba(107,114,128,0.08)}
.blank.lens  {background: rgba(20,184,166,0.06); color:var(--color-lens); border:1px solid rgba(20,184,166,0.08)}

.muted{color:var(--muted)}
.hidden{display:none}

@media(max-width:980px){
  .container{flex-direction:column}
  .progress-column{max-width:none}
}
