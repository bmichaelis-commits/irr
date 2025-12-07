(() => {
  const state = { topic:"", lens:"", stakeholders:[], location:"", timeframe:"", aspect:"", draft:"", complexityKey:"", complexityNote:"" };

  const GUIDANCE = {
    Economic:`Economic Lens: What industries, markets, or policies could you investigate?`,
    Scientific:`Scientific Lens: Focus on discoveries, gaps, or controversies.`,
    Environmental:`Environmental Lens: Impact of human activity or natural processes.`,
    Political:`Political Lens: Policies, actors, or conflicts to examine.`,
    "Social/Cultural":`Social/Cultural Lens: Communities affected or perspectives underrepresented.`,
    Ethical:`Ethical Lens: Responsibilities, competing rights, or dilemmas.`,
    "Artistic/Philosophical":`Artistic/Philosophical Lens: Works, values, or debates of meaning.`
  };

  const STEM_TEMPLATES = [
    `How has <span class="blank aspect">(aspect)</span> impacted <span class="blank stake">(stakeholders)</span>?`,
    `To what extent does <span class="blank aspect">(aspect)</span> affect <span class="blank stake">(stakeholders)</span> in <span class="blank loc">(location)</span>?`,
    `How effective are responses to <span class="blank aspect">(aspect)</span> for <span class="blank stake">(stakeholders)</span> over <span class="blank time">(timeframe)</span>?`
  ];

  const COMPLEXITY = {
    "trade-offs": {label:"Trade-offs", definition:"Choosing one option requires giving up another.", example:"Example: Economic growth vs environmental protection."},
    "competing needs": {label:"Competing needs", definition:"Stakeholders require conflicting priorities.", example:"Example: Urban development vs preserving green spaces."},
    "conflicting evidence": {label:"Conflicting evidence", definition:"Sources provide contradictory information.", example:"Example: Studies disagree on new drug efficacy."},
    "unintended consequences": {label:"Unintended consequences", definition:"Unexpected outcomes result from an action.", example:"Example: Plastic bag ban increases small bag use."}
  };

  const $ = id => document.getElementById(id);

  function showStep(n){
    for(let i=1;i<=8;i++){let el=$(`step-${i}`); if(el) el.classList.add("hidden");}
    $(`step-${n}`).classList.remove("hidden"); renderProgress();
  }

  function renderProgress(){
    const list=$("progressList"); list.innerHTML="";
    const items=[
      ["Topic", state.topic,"progress-topic"],
      ["Lens", state.lens,"progress-lens"],
      ["Stakeholders",state.stakeholders.join(", "),"progress-stake"],
      ["Location", state.location,"progress-loc"],
      ["Time frame", state.timeframe,"progress-time"],
      ["Aspect", state.aspect,"progress-aspect"]
    ];
    items.forEach(([label,value,cls])=>{
      const div=document.createElement("div"); div.className="progress-item";
      div.innerHTML=`<span class="progress-swatch ${cls}"></span>${label}: ${value || "—"}`;
      list.appendChild(div);
    });
  }

  function renderStems(){
    const box=$("stemsBox"); box.innerHTML="";
    STEM_TEMPLATES.forEach(tpl=>{
      const div=document.createElement("div"); div.innerHTML=tpl;
      div.querySelectorAll(".blank.aspect").forEach(b=>b.title=state.aspect||"(aspect)");
      div.querySelectorAll(".blank.stake").forEach(b=>b.title=state.stakeholders.join(", ")||"(stakeholders)");
      div.querySelectorAll(".blank.loc").forEach(b=>b.title=state.location||"(location)");
      div.querySelectorAll(".blank.time").forEach(b=>b.title=state.timeframe||"(timeframe)");
      box.appendChild(div); box.appendChild(document.createElement("br"));
    });
  }

  function renderComplexityButtons(){
    const container=$("complexButtons"); container.innerHTML="";
    Object.keys(COMPLEXITY).forEach(k=>{
      const btn=document.createElement("button"); btn.innerText=COMPLEXITY[k].label;
      btn.onclick=()=>{
        state.complexityKey=k;
        Array.from(container.children).forEach(c=>c.classList.remove("selected"));
        btn.classList.add("selected");
        const info=$("complexInfo"); info.classList.remove("hidden");
        info.innerHTML=`<strong>${COMPLEXITY[k].label}</strong><br><em>Definition:</em> ${COMPLEXITY[k].definition}<br><em>Example:</em> ${COMPLEXITY[k].example}`;
      };
      container.appendChild(btn);
    });
  }

  function renderReport(){
    $("reportDraft").innerText=state.draft||"(none)";
    const comps=$("reportComponents"); comps.innerHTML="";
    [["Topic",state.topic],["Lens",state.lens],["Stakeholders",state.stakeholders.join(", ")],["Location",state.location],["Time frame",state.timeframe],["Aspect",state.aspect]].forEach(([label,val])=>{
      const div=document.createElement("div"); div.innerHTML=`<strong>${label}:</strong> ${val||"—"}`;
      comps.appendChild(div);
    });
    const stems=$("reportStems"); stems.innerHTML="";
    if(state.complexityKey){ const c=COMPLEXITY[state.complexityKey]; stems.innerHTML=`<strong>${c.label}</strong><br>${c.definition}<br><em>${c.example}</em>`;}
  }

  async function copyReport(){
    let text=`Draft: ${state.draft}\nTopic: ${state.topic}\nLens: ${state.lens}\nStakeholders: ${state.stakeholders.join(", ")}\nLocation: ${state.location}\nTimeframe: ${state.timeframe}\nAspect: ${state.aspect}\nComplexity: ${state.complexityKey || "(none)"}\nNotes: ${state.complexityNote || "(none)"}`;
    try{ await navigator.clipboard.writeText(text); alert("Report copied!"); }catch{ alert("Copy failed."); }
  }

  function wireUI(){
    $("btnToStep2").onclick=()=>{
      const t=$("topicInput").value.trim(); const l=$("lensSelect").value;
      if(!t||!l){alert("Enter topic and lens."); return;}
      state.topic=t; state.lens=l; $("aspectGuidance").innerText=GUIDANCE[l]; showStep(2);
    };
    $("btnBackTo1").onclick=()=>showStep(1);
    $("btnToStep3").onclick=()=>{
      const s=[ $("stake1").value.trim(), $("stake2").value.trim(), $("stake3").value.trim(), $("stake4").value.trim() ].filter(Boolean);
      if(!s.length){alert("Enter at least one stakeholder."); return;}
      state.stakeholders=s; showStep(3);
    };
    $("btnBackTo2").onclick=()=>showStep(2);
    $("btnToStep4").onclick=()=>{
      const loc=$("locationInput").value.trim(); if(!loc){alert("Enter location."); return;} state.location=loc; showStep(4);
    };
    $("btnBackTo3").onclick=()=>showStep(3);
    $("btnToStep5").onclick=()=>{
      const tf=$("timeInput").value.trim(); if(!tf){alert("Enter time frame."); return;} state.timeframe=tf; showStep(5);
    };
    $("btnBackTo4").onclick=()=>showStep(4);
    $("btnToStep6").onclick=()=>{
      const a=$("aspectInput").value.trim(); if(!a){alert("Enter aspect."); return;} state.aspect=a; renderStems(); showStep(6);
    };
    $("btnBackTo5").onclick=()=>showStep(5);
    $("btnToStep7").onclick=()=>{
      const d=$("draftInput").value.trim(); if(!d){alert("Enter draft."); return;} state.draft=d; renderComplexityButtons(); showStep(7);
    };
    $("btnBackTo6").onclick=()=>showStep(6);
    $("btnFinish").onclick=()=>{
      state.complexityNote=$("complexExplain").value.trim(); if(!state.complexityKey){alert("Select complexity."); return;}
      renderReport(); showStep(8);
    };
    $("btnRestart").onclick=()=>location.reload();
    $("btnCopy").onclick=copyReport;
  }

  document.addEventListener("DOMContentLoaded",()=>{ wireUI(); showStep(1); renderProgress(); });

})();
