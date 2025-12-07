(() => {
  // ====== Data ======
  const GUIDANCE = {
    Economic: `Economic Lens\nWhat industries, markets, or sectors are affected?\nExample: Climate Change → Economic costs of rising sea levels`,
    Scientific: `Scientific Lens\nFocus on discoveries, controversies, or technologies\nExample: AI → Accuracy of facial recognition algorithms`,
    Environmental: `Environmental Lens\nNatural processes or human activity\nExample: Water Pollution → Impact of agricultural runoff`,
    Political: `Political Lens\nPolicy, actors, conflicts\nExample: Immigration → Effectiveness of visa policy`,
    "Social/Cultural": `Social/Cultural Lens\nCommunity impact or underrepresented perspectives\nExample: Technology → Social media & teen mental health`,
    Ethical: `Ethical Lens\nWho is responsible, competing rights\nExample: AI → Ethical concerns of autonomous vehicles`,
    "Artistic/Philosophical": `Artistic/Philosophical Lens\nCreative or philosophical perspective\nExample: Street Art → Influence on public perception`
  };

  const STEM_TEMPLATES = [
    `How has <span class="blank aspect">(aspect)</span> impacted <span class="blank stake">(stakeholders)</span>?`,
    `To what extent does <span class="blank aspect">(aspect)</span> affect <span class="blank stake">(stakeholders)</span> in <span class="blank loc">(location)</span>?`,
    `How effective are responses to <span class="blank aspect">(aspect)</span> for <span class="blank stake">(stakeholders)</span> over <span class="blank time">(time frame)</span>?`,
    `What challenges do <span class="blank stake">(stakeholders)</span> face regarding <span class="blank aspect">(aspect)</span>?`,
    `How could changes in <span class="blank aspect">(aspect)</span> influence <span class="blank stake">(stakeholders)</span> and their environment?`
  ];

  const COMPLEXITY = {
    "trade-offs": {label:"Trade-offs", definition:"Trade-offs are situations where choosing one option requires giving up another.", example:"Example: Choosing between economic growth and environmental protection."},
    "competing needs": {label:"Competing needs", definition:"Competing needs occur when different stakeholders require conflicting resources or priorities.", example:"Example: Balancing urban development with preserving community green spaces."},
    "conflicting evidence": {label:"Conflicting evidence", definition:"Conflicting evidence arises when sources provide contradictory information.", example:"Example: Studies disagree on the effectiveness of a new drug."},
    "unintended consequences": {label:"Unintended consequences", definition:"Unintended consequences are outcomes that were not predicted.", example:"Example: Plastic bag ban increased small bag usage."}
  };

  const COLORS = {topic:"topic", lens:"lens", stakeholder:"stakeholder", location:"location", timeframe:"time", aspect:"aspect"};

  const state = {topic:"", lens:"", stakeholders:[], location:"", timeframe:"", aspect:"", draft:"", complexityKey:"", complexityNote:""};

  const $ = id => document.getElementById(id);

  function updateProgress(){
    const list = $("progressList"); list.innerHTML="";
    function row(label,value,key){ const div=document.createElement("div"); div.className="report-box"; div.innerHTML=`<span class="blank ${key}" style="font-weight:normal;margin-right:6px"> </span> <strong>${label}:</strong> ${value||"—"}`; list.appendChild(div);}
    row("Topic",state.topic,"topic");
    row("Lens",state.lens,"lens");
    row("Stakeholders",state.stakeholders.join(", "),"stakeholder");
    row("Location",state.location,"loc");
    row("Time frame",state.timeframe,"time");
    row("Aspect",state.aspect,"aspect");
    row("Complexity", state.complexityKey ? COMPLEXITY[state.complexityKey].label : "—","topic");
  }

  function safeGuidance(key){ return GUIDANCE[key]||"No guidance available.";}
  function showLensGuidance(){ $("aspectGuidance").innerText=safeGuidance(state.lens); }

  function renderStems(){
    const box=$("stemsBox"); box.innerHTML="<strong>Sentence-stem options</strong><br><br>";
    STEM_TEMPLATES.forEach(tpl=>{
      const div=document.createElement("div"); div.className="stem-item"; div.innerHTML=tpl;
      const aspectBlank=div.querySelector(".blank.aspect"); if(aspectBlank) aspectBlank.title=state.aspect||"(aspect)";
      const stakeBlank=div.querySelector(".blank.stake"); if(stakeBlank) stakeBlank.title=state.stakeholders.join(", ")||"(stakeholders)";
      const locBlank=div.querySelector(".blank.loc"); if(locBlank) locBlank.title=state.location||"(location)";
      const timeBlank=div.querySelector(".blank.time"); if(timeBlank) timeBlank.title=state.timeframe||"(time frame)";
      box.appendChild(div); box.appendChild(document.createElement("br"));
    });
  }

  function renderComplexityButtons(){
    const container=$("complexButtons"); container.innerHTML="";
    Object.keys(COMPLEXITY).forEach(k=>{
      const btn=document.createElement("button"); btn.className="btn"; btn.innerText=COMPLEXITY[k].label;
      btn.onclick=()=>{
        state.complexityKey=k;
        Array.from(container.children).forEach(c=>c.classList.remove("selected")); btn.classList.add("selected");
        const info=$("complexInfo"); info.classList.remove("hidden"); info.innerHTML=`<strong>${COMPLEXITY[k].label}</strong><br><em>Definition:</em> ${COMPLEXITY[k].definition}<br><em>Example:</em> ${COMPLEXITY[k].example}`;
      };
      container.appendChild(btn);
    });
  }

  function renderReport(){
    $("reportDraft").innerText=state.draft||"(No draft)";
    const comps=$("reportComponents"); comps.innerHTML="";
    function add(title,content,key){ const div=document.createElement("div"); div.className="report-box"; div.innerHTML=`<span class="blank ${key}" style="font-weight:normal;margin-right:6px"></span><strong>${title}</strong>: ${content||"—"}`; comps.appendChild(div);}
    add("Topic",state.topic,"topic"); add("Lens",state.lens,"lens"); add("Stakeholders",state.stakeholders.join(", "),"stakeholder");
    add("Location",state.location,"loc"); add("Time frame",state.timeframe,"time"); add("Aspect",state.aspect,"aspect");
    const stemsBox=$("reportStems"); stemsBox.innerHTML="";
    if(state.complexityKey){
      const list=COMPLEXITY[state.complexityKey];
      stemsBox.innerHTML=`<strong>${list.label}</strong><div style="color:var(--muted)">${list.definition}</div><div style="color:var(--muted)"><em>${list.example}</em></div>`;
    }
    updateProgress();
  }

  async function copyReportToClipboard(){
    let text=`Draft:\n${state.draft||"(none)"}\n\nTopic: ${state.topic}\nLens: ${state.lens}\nStakeholders: ${state.stakeholders.join(", ")}\nLocation: ${state.location}\nTime frame: ${state.timeframe}\nAspect: ${state.aspect}\nComplex
