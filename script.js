(() => {
  const GUIDANCE = {
    Economic: `1. Economic Lens
What industries, markets, or sectors are affected?
What specific economic policy or regulation could you investigate?
Example:
Climate Change → Aspect: Economic costs of rising sea levels on coastal cities`,
    Scientific: `2. Scientific Lens
What scientific discoveries or innovations could you focus on?
Is there a gap, controversy, or emerging technology in this area?
Examples:
AI → Aspect: Accuracy of facial recognition algorithms for different populations
Climate Change → Aspect: Effectiveness of carbon capture technologies`,
    Environmental: `3. Environmental Lens
What natural processes or human activity could you focus on?
Is there a policy, behavior, or technologies addressing the issue you could investigate?
Examples:
Water Pollution → Aspect: Impact of agricultural runoff on freshwater ecosystems
Climate Change → Aspect: Rising sea levels affecting coastal communities`,
    Political: `4. Political Lens
Is there a policy, law, or program related to this issue you could focus on?
Is there a political actor you could focus on?
Is there a particular conflict between levels of government or stakeholders you could focus on?
Examples:
Immigration → Aspect: Effectiveness of a specific visa policy on migrant populations
Climate Change → Aspect: Government incentives for renewable energy adoption`,
    "Social/Cultural": `5. Social/Cultural Lens
Is there a community or groups most affected or whose perspective is underrepresented?
Is there a particular change in beliefs, behaviors, or practices you could focus on?
Is there a conflict or difference between cultural perspectives you could focus on?
Examples:
Technology → Aspect: How social media affects teenagers’ mental health
Immigration → Aspect: Cultural integration challenges for refugees`,
    Ethical: `6. Ethical Lens
Who is responsible for action or decision-making?
Are there competing rights or duties?
Are there controversial practices or outcomes?
Examples:
Artificial Intelligence → Aspect: Ethical concerns of autonomous vehicles making life-and-death decisions
Medical Research → Aspect: Ethical dilemmas in human gene editing`,
    "Artistic/Philosophical": `7. Artistic/Philosophical
Is there a creative work or philosophical perspective that could inform this topic?
What ideas, values, or perceptions are at stake?
Are there debates about meaning, purpose, or cultural significance?
Example:
Street Art → Aspect: Influence of street art on public perception of urban issues`
  };

  const STEM_TEMPLATES = [
    `How has <span class="blank aspect"> (aspect) </span> impacted <span class="blank stake"> (stakeholders) </span>?`,
    `To what extent does <span class="blank aspect"> (aspect) </span> affect <span class="blank stake"> (stakeholders) </span> in <span class="blank loc"> (location) </span>?`,
    `How effective are responses to <span class="blank aspect"> (aspect) </span> for <span class="blank stake"> (stakeholders) </span> over <span class="blank time"> (time frame) </span>?`,
    `What challenges do <span class="blank stake"> (stakeholders) </span> face regarding <span class="blank aspect"> (aspect) </span>?`,
    `How could changes in <span class="blank aspect"> (aspect) </span> influence <span class="blank stake"> (stakeholders) </span> and their environment?`
  ];

  const COMPLEXITY = {
    "trade-offs": {
      label: "Trade-offs",
      definition: "Trade-offs are situations where choosing one option requires giving up another.",
      example: "Example: Choosing between economic growth and environmental protection."
    },
    "competing needs": {
      label: "Competing needs",
      definition: "Competing needs occur when different stakeholders require conflicting resources or priorities.",
      example: "Example: Balancing urban development with preserving community green spaces."
    },
    "conflicting evidence": {
      label: "Conflicting evidence",
      definition: "Conflicting evidence arises when sources provide contradictory information or interpretations.",
      example: "Example: Studies disagree on the effectiveness of a new drug."
    },
    "unintended consequences": {
      label: "Unintended consequences",
      definition: "Unintended consequences are outcomes that happen as a result of an action or solution, but were not predicted or planned. These outcomes can be positive or negative.",
      example: "Example: When plastic grocery bags were banned, some households began buying more small trash bags, increasing plastic use instead of reducing it."
    }
  };

  const COLORS = {
    topic: "topic-swatch",
    lens: "lens-swatch",
    stakeholder: "stakeholder-swatch",
    location: "location-swatch",
    timeframe: "timeframe-swatch",
    aspect: "aspect-swatch"
  };

  const state = { topic:"", lens:"", stakeholders:[], location:"", timeframe:"", aspect:"", draft:"", complexityKey:"", complexityNote:"" };

  const $ = id => document.getElementById(id);
  const safeGuidance = key => GUIDANCE[key] || "No guidance available for this lens.";

  function renderStems() {
    const stemsBox = $("stemsBox");
    stemsBox.innerHTML = "<strong>Sentence-stem options</strong><br><br>";
    STEM_TEMPLATES.forEach(tpl => {
      const wrapper = document.createElement("div");
      wrapper.className = "stem-item";
      wrapper.innerHTML = tpl;
      wrapper.querySelector(".blank.aspect")?.setAttribute("title", state.aspect||"(aspect)");
      wrapper.querySelector(".blank.stake")?.setAttribute("title", state.stakeholders.join(", ")||"(stakeholders)");
      wrapper.querySelector(".blank.loc")?.setAttribute("title", state.location||"(location)");
      wrapper.querySelector(".blank.time")?.setAttribute("title", state.timeframe||"(time frame)");
      stemsBox.appendChild(wrapper);
      stemsBox.appendChild(document.createElement("br"));
    });
  }

  function updateProgress() {
    const list = $("progressList");
    list.innerHTML = "";
    function makeRow(label,value,swatchClass){
      const div = document.createElement("div");
      div.style.display="flex"; div.style.alignItems="center"; div.style.gap="6px"; 
      const sw = document.createElement("span");
      sw.className=`legend-swatch ${swatchClass}`;
      div.appendChild(sw);
      div.innerHTML += `<strong>${label}:</strong> ${value||"—"}`;
      list.appendChild(div);
    }
    makeRow("Topic", state.topic, "topic-swatch");
    makeRow("Lens", state.lens, "lens-swatch");
    makeRow("Stakeholders", state.stakeholders.join(", "), "stakeholder-swatch");
    makeRow("Location", state.location, "location-swatch");
    makeRow("Time frame", state.timeframe, "timeframe-swatch");
    makeRow("Aspect", state.aspect, "aspect-swatch");
  }

  function showLensGuidance(){ $("aspectGuidance").innerText = safeGuidance(state.lens); }

  function renderComplexityButtons(){
    const container = $("complexButtons");
    container.innerHTML="";
    Object.keys(COMPLEXITY).forEach(k=>{
      const btn = document.createElement("button");
      btn.className="btn";
      btn.innerText = COMPLEXITY[k].label;
      btn.onclick = ()=>{
        state.complexityKey=k;
        Array.from(container.children).forEach(c=>c.classList.remove("selected"));
        btn.classList.add("selected");
        const info = $("complexInfo");
        info.classList.remove("hidden");
        info.innerHTML=`<strong>${COMPLEXITY[k].label}</strong><br><em>Definition:</em> ${COMPLEXITY[k].definition}<br><em>Example:</em> ${COMPLEXITY[k].example}`;
      };
      container.appendChild(btn);
    });
  }

  function renderReport(){
    $("reportDraft").innerText=state.draft||"(No draft)";
    const comps=$("reportComponents"); comps.innerHTML="";
    function addComp(title,content,swatch){
      const div=document.createElement("div"); div.style.display="flex"; div.style.alignItems="center"; div.style.gap="6px";
      const sw=document.createElement("span"); sw.className=`legend-swatch ${swatch}`;
      div.appendChild(sw); div.innerHTML+=`<strong>${title}</strong>: ${content||"—"}`;
      comps.appendChild(div);
    }
    addComp("Topic", state.topic,"topic-swatch");
    addComp("Lens", state.lens,"lens-swatch");
    addComp("Stakeholders", state.stakeholders.join(", "),"stakeholder-swatch");
    addComp("Location", state.location,"location-swatch");
    addComp("Time frame", state.timeframe,"timeframe-swatch");
    addComp("Aspect", state.aspect,"aspect-swatch");

    const stemsBox=$("reportStems"); stemsBox.innerHTML="";
    if(state.complexityKey){
      const list=COMPLEXITY[state.complexityKey];
      stemsBox.innerHTML=`<strong>${list.label} — prompts</strong><div style="color:var(--muted)">${list.definition}</div><div style="margin-top:6px;color:var(--muted)"><em>${list.example}</em></div>`;
    } else stemsBox.innerHTML="<em>No complexity selected.</em>";
    updateProgress();
  }

  async function copyReportToClipboard(){
    let text=`Draft: ${state.draft||"(none)"}\nTopic: ${state.topic}\nLens: ${state.lens}\nStakeholders: ${state.stakeholders.join(", ")}\nLocation: ${state.location}\nTime frame: ${state.timeframe}\nAspect: ${state.aspect}\nComplexity: ${state.complexityKey?COMPLEXITY[state.complexityKey].label:"(none)"}\n\n`;
    if(state.complexityKey){ text+=`${COMPLEXITY[state.complexityKey].definition}\n${COMPLEXITY[state.complexityKey].example}`; }
    else text+=STEM_TEMPLATES.join("\n");
    try{await navigator.clipboard.writeText(text); alert("Report copied.");} catch(e){alert("Cannot copy; select manually.");}
  }

  function wireUI(){
    $("btnToStep2").onclick=()=>{
      const t=$("topicInput").value.trim(); const l=$("lensSelect").value;
      if(!t||!l){alert("Enter topic + lens");return;}
      state.topic=t; state.lens=l; showLensGuidance(); updateProgress(); showStep(2);
    };
    $("btnBackTo1").onclick=()=>showStep(1);
    $("btnToStep3").onclick=()=>{
      const s=[ $("stake1").value,$("stake2").value,$("stake3").value,$("stake4").value ].filter(Boolean);
      if(!s.length){alert("Enter at least one stakeholder");return;}
      state.stakeholders=s; updateProgress(); showStep(3);
    };
    $("btnBackTo2").onclick=()=>showStep(2);
    $("btnToStep4").onclick=()=>{
      const loc=$("locationInput").value.trim(); if(!loc){alert("Enter location");return;} state.location=loc; updateProgress(); showStep(4);
    };
    $("btnBackTo3").onclick=()=>showStep(
