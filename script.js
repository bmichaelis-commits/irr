(() => {
  const GUIDANCE = {
    Economic: `What industries, markets, or sectors are affected?\nWhat specific economic policy or regulation could you investigate?\nExample: Climate Change → Economic costs of rising sea levels on coastal cities`,
    Scientific: `What scientific discoveries or innovations could you focus on?\nIs there a gap, controversy, or emerging technology?\nExample: AI → Accuracy of facial recognition algorithms for different populations`,
    Environmental: `What natural processes or human activity could you focus on?\nAre there policies, behaviors, or technologies addressing this?\nExample: Water Pollution → Impact of agricultural runoff on freshwater ecosystems`,
    Futuristic: `What predicted impacts or long-term consequences could you investigate?\nHow might trends today shape future outcomes?\nExample: AI adoption → Predicted effects on employment in the next 20 years`,
    Political: `Is there a policy, law, or program you could focus on?\nIs there a political actor or conflict?\nExample: Immigration → Effectiveness of a visa policy`,
    "Social/Cultural": `Is there a community or groups most affected or underrepresented?\nAre there cultural conflicts or changes in practices?\nExample: Technology → How social media affects teenagers’ mental health`,
    Ethical: `Who is responsible for action?\nAre there competing rights or controversial outcomes?\nExample: AI → Ethical concerns of autonomous vehicles`,
    "Artistic/Philosophical": `Is there a creative work or philosophical perspective?\nWhat ideas, values, or perceptions are at stake?\nExample: Street Art → Influence on public perception`
  };

  const STEM_TEMPLATES = [
    `How has <span class="blank aspect">(aspect)</span> impacted <span class="blank stake">(stakeholders)</span>?`,
    `To what extent does <span class="blank aspect">(aspect)</span> affect <span class="blank stake">(stakeholders)</span> in <span class="blank loc">(location)</span>?`,
    `How effective are responses to <span class="blank aspect">(aspect)</span> for <span class="blank stake">(stakeholders)</span> over <span class="blank time">(time frame)</span>?`,
    `How could changes in <span class="blank aspect">(aspect)</span> influence <span class="blank stake">(stakeholders)</span> in <location>?`
  ];

  const COMPLEXITY = {
    "trade-offs": { label: "Trade-offs", definition: "Choosing one option requires giving up another.", 
                   example: "Choosing economic growth vs environmental protection." },
    "competing needs": { label: "Competing Needs", definition: "Different stakeholders require conflicting resources or priorities.", 
                        example: "Balancing urban development with green space preservation." },
    "conflicting evidence": { label: "Conflicting Evidence", definition: "Sources provide contradictory information or interpretations.", 
                             example: "Studies disagree on the effectiveness of a new drug." },
    "unintended consequences": { label: "Unintended Consequences", definition: "Outcomes happen as a result of an action but were not predicted.", 
                                example: "Plastic bag bans led to increased purchase of small trash bags." }
  };

  // Add a color class for complexity swatch
  const COLORS = {
    topic: "blank topic",
    lens: "blank lens",
    stakeholder: "blank stake",
    location: "blank loc",
    timeframe: "blank time",
    aspect: "blank aspect",
    complexity: "blank aspect" // reusing aspect style, can customize if needed
  };

 // const state = { 
//    topic:"", lens:"", stakeholders:[], location:"", timeframe:"", aspect:"", draft:"", 
//    complexityKey:"", complexityNote:"" 
//  };

  const $ = id => document.getElementById(id);

  // --- Progress Sidebar ---
  function updateProgress() {
    const list = $("progressList");
    list.innerHTML = "";

    function row(label, value, colorClass){
      const div = document.createElement("div");
      div.innerHTML = `<span class="${colorClass}" style="width:20px;height:14px;display:inline-block;margin-right:6px;border-radius:3px;"></span> <strong>${label}:</strong> ${value || "—"}`;
      list.appendChild(div);
    }

    row("Topic", state.topic, COLORS.topic);
    row("Lens", state.lens, COLORS.lens);
    row("Stakeholders", state.stakeholders.join(", "), COLORS.stakeholder);
    row("Location", state.location, COLORS.location);
    row("Time frame", state.timeframe, COLORS.timeframe);
    row("Aspect", state.aspect, COLORS.aspect);
    row("Complexity", state.complexity, COLORS.complexity);
  }

  // --- Sentence Stems ---
  function renderStems(){
    const box = $("stemsBox");
    box.innerHTML = "<strong>Sentence-stem options:</strong><br><br>";
    STEM_TEMPLATES.forEach(tpl=>{
      const div = document.createElement("div");
      div.innerHTML = tpl;
      div.querySelectorAll(".blank.aspect").forEach(el=>el.title = state.aspect || "(aspect)");
      div.querySelectorAll(".blank.stake").forEach(el=>el.title = state.stakeholders.join(", ") || "(stakeholders)");
      div.querySelectorAll(".blank.loc").forEach(el=>el.title = state.location || "(location)");
      div.querySelectorAll(".blank.time").forEach(el=>el.title = state.timeframe || "(time frame)");
      box.appendChild(div);
    });
  }

  // --- Aspect Guidance ---
  function showAspectGuidance(){
    $("aspectGuidance").innerText = GUIDANCE[state.lens] || "";
  }

  // --- Complexity Buttons ---
  function renderComplexityButtons(){
    const container = $("complexButtons"); 
    container.innerHTML="";
    Object.keys(COMPLEXITY).forEach(k=>{
      const btn = document.createElement("button");
      btn.className="btn"; 
      btn.innerText = COMPLEXITY[k].label;
      btn.onclick = ()=>{
        state.complexityKey = k;
        container.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
        btn.classList.add("selected");
        const info = $("complexInfo");
        info.classList.remove("hidden");
        info.innerHTML = `<strong>${COMPLEXITY[k].label}</strong><br><em>Definition:</em> ${COMPLEXITY[k].definition}<br><em>Example:</em> ${COMPLEXITY[k].example}`;
        updateProgress(); // <-- update sidebar immediately
      };
      container.appendChild(btn);
    });
  }

  // --- Report ---
 unction renderReport(){
  $("reportDraft").innerText = state.draft || "(No draft)";

  const comps = $("reportComponents");
  comps.innerHTML = "";

  function add(title, val){
    comps.innerHTML += `<div><strong>${title}:</strong> ${val || "—"}</div>`;
  }

  add("Topic", state.topic);
  add("Lens", state.lens);
  add("Stakeholders", state.stakeholders.join(", "));
  add("Location", state.location);
  add("Time frame", state.timeframe);
  add("Aspect", state.aspect);
  add("Complexity", state.complexityKey ? COMPLEXITY[state.complexityKey].label : "");

  // Optionally include the student’s note about complexity
  if(state.complexityNote){
    comps.innerHTML += `<div><strong>Complexity Note:</strong> ${state.complexityNote}</div>`;
  }

  // Clear stems in the report
  $("reportStems").innerHTML = "";
}

  // --- Step Handling ---
  function showStep(n){ 
    document.querySelectorAll(".step").forEach(s=>s.classList.add("hidden")); 
    $(`step-${n}`).classList.remove("hidden"); 
    updateProgress(); 
    if(n==6) renderStems(); 
    if(n==7) renderComplexityButtons(); 
    if(n==5) showAspectGuidance(); 
  }

  // --- Navigation ---
  $("btnToStep2").onclick = ()=>{ 
    state.topic=$("topicInput").value; 
    state.lens=$("lensSelect").value; 
    showStep(2); 
  };
  $("btnBackTo1").onclick = ()=>showStep(1); 

  $("btnToStep3").onclick = ()=>{ 
    state.stakeholders=[ $("stake1").value,$("stake2").value,$("stake3").value,$("stake4").value].filter(Boolean); 
    showStep(3); 
  };
  $("btnBackTo2").onclick = ()=>showStep(2); 

  $("btnToStep4").onclick = ()=>{ 
    state.location=$("locationInput").value; 
    showStep(4); 
  };
  $("btnBackTo3").onclick = ()=>showStep(3); 

  $("btnToStep5").onclick = ()=>{ 
    state.timeframe=$("timeInput").value; 
    showStep(5); 
  };
  $("btnBackTo4").onclick = ()=>showStep(4); 

  $("btnToStep6").onclick = ()=>{ 
    state.aspect=$("aspectInput").value; 
    showStep(6); 
  };
  $("btnBackTo5").onclick = ()=>showStep(5); 

  $("btnToStep7").onclick = ()=>{ 
    state.draft=$("draftInput").value; 
    showStep(7); 
  };
  $("btnBackTo6").onclick = ()=>showStep(6); 

  $("btnFinish").onclick = ()=>{
    state.complexityNote=$("complexExplain").value; 
    showStep(8); 
    renderReport(); 
  };
  $("btnRestart").onclick = ()=>location.reload();
  $("btnCopy").onclick = ()=>{
    navigator.clipboard.writeText(document.getElementById("reportCard").innerText);
    alert("Copied to clipboard!");
  };

  showStep(1);
})();
