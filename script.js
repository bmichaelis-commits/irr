/* IRR Question Wizard - modular single-file logic
   Designed to be stable and easy to edit.
*/

(() => {
  // ====== Data / guidance / config ======
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
    `How has <span class="blank aspect"> (aspect of problem) </span> impacted <span class="blank stake"> (stakeholders) </span>?`,
    `To what extent does <span class="blank aspect"> (aspect of problem) </span> affect <span class="blank stake"> (stakeholders) </span> in <span class="blank loc"> (location) </span>?`,
    `How effective are responses to <span class="blank aspect"> (aspect of problem) </span> for <span class="blank stake"> (stakeholders) </span> over <span class="blank time"> (time frame) </span>?`,
    `What challenges do <span class="blank stake"> (stakeholders) </span> face regarding <span class="blank aspect"> (aspect of problem) </span>?`,
    `How could changes in <span class="blank aspect"> (aspect of problem) </span> influence <span class="blank stake"> (stakeholders) </span> and their environment?`
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

  // ====== State ======
  const state = {
    topic: "",
    lens: "",
    stakeholders: [],
    location: "",
    timeframe: "",
    aspect: "",
    draft: "",
    complexityKey: "",
    complexityNote: ""
  };

  // ====== Helpers ======
  const $ = (id) => document.getElementById(id);
  function safeGuidance(key) {
    return GUIDANCE[key] || "No guidance available for this lens.";
  }

  // render stems into stems box with colored blanks that show current answers as tooltips
  function renderStems() {
    const stemsBox = $("stemsBox");
    stemsBox.innerHTML = "<strong>Sentence-stem options (fill the blanks yourself)</strong><br><br>";
    STEM_TEMPLATES.forEach((tpl) => {
      // Build a temporary div and then color blanks and attach title
      const wrapper = document.createElement("div");
      wrapper.className = "stem-item";
      wrapper.innerHTML = tpl;
      // update each blank's title based on state
      const aspectBlank = wrapper.querySelector(".blank.aspect");
      if (aspectBlank) aspectBlank.title = state.aspect || "(aspect)";
      const stakeBlank = wrapper.querySelector(".blank.stake");
      if (stakeBlank) stakeBlank.title = state.stakeholders.join(", ") || "(stakeholders)";
      const locBlank = wrapper.querySelector(".blank.loc");
      if (locBlank) locBlank.title = state.location || "(location)";
      const timeBlank = wrapper.querySelector(".blank.time");
      if (timeBlank) timeBlank.title = state.timeframe || "(time frame)";
      stemsBox.appendChild(wrapper);
      stemsBox.appendChild(document.createElement("br"));
    });
  }

  // update right column progress with color-coded blocks + tooltips
  function updateProgress() {
    const list = $("progressList");
    list.innerHTML = "";

    function makeRow(label, value, swatchClass) {
      const div = document.createElement("div");
      div.className = "report-box";
      const sw = document.createElement("span");
      sw.className = `legend-swatch ${swatchClass}`;
      sw.style.marginRight = "8px";
      div.innerHTML = `<strong>${label}:</strong> ${value || "<em>—</em>"}`;
      div.prepend(sw);
      list.appendChild(div);
    }

    makeRow("Topic", state.topic || "—", "topic-swatch");
    makeRow("Lens", state.lens || "—", "lens-swatch");
    makeRow("Stakeholders", (state.stakeholders.length ? state.stakeholders.join(", ") : "—"), "stakeholder-swatch");
    makeRow("Location", state.location || "—", "location-swatch");
    makeRow("Time frame", state.timeframe || "—", "timeframe-swatch");
    makeRow("Aspect", state.aspect || "—", "aspect-swatch");
    makeRow("Complexity", (state.complexityKey ? COMPLEXITY[state.complexityKey].label : "—"), "topic-swatch");
  }

  // show lens guidance safely
  function showLensGuidance() {
    const box = $("aspectGuidance");
    box.innerText = safeGuidance(state.lens);
  }

  // show complexity buttons
  function renderComplexityButtons() {
    const container = $("complexButtons");
    container.innerHTML = "";
    Object.keys(COMPLEXITY).forEach((k) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.innerText = COMPLEXITY[k].label;
      btn.onclick = () => {
        state.complexityKey = k;
        // highlight selection visually
        Array.from(container.children).forEach(c => c.classList.remove("selected"));
        btn.classList.add("selected");
        // show info
        const info = $("complexInfo");
        info.classList.remove("hidden");
        info.innerHTML = `<strong>${COMPLEXITY[k].label}</strong><br>
          <em>Definition:</em> ${COMPLEXITY[k].definition}<br>
          <em>Example:</em> ${COMPLEXITY[k].example}`;
      };
      container.appendChild(btn);
    });
  }

  // show final report
  function renderReport() {
    $("reportDraft").innerText = state.draft || "(No draft entered)";
    const comps = $("reportComponents");
    comps.innerHTML = "";

    function addComp(title, content, swatch) {
      const row = document.createElement("div");
      row.className = "report-box";
      row.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
        <span class="legend-swatch ${swatch}"></span>
        <div><strong>${title}</strong><div style="color:var(--muted)">${content || "—"}</div></div>
      </div>`;
      comps.appendChild(row);
    }

    addComp("Topic", state.topic, "topic-swatch");
    addComp("Lens", state.lens, "lens-swatch");
    addComp("Stakeholders", state.stakeholders.join(", "), "stakeholder-swatch");
    addComp("Location", state.location, "location-swatch");
    addComp("Time frame", state.timeframe, "timeframe-swatch");
    addComp("Aspect", state.aspect, "aspect-swatch");

    // complexity stems
    const stemsBox = $("reportStems");
    stemsBox.innerHTML = "";
    if (state.complexityKey) {
      const list = COMPLEXITY[state.complexityKey];
      stemsBox.innerHTML = `<strong>${list.label} — prompts</strong><div style="margin-top:8px;color:var(--muted)">${list.definition}</div><div style="margin-top:6px;color:var(--muted)"><em>${list.example}</em></div>`;
    } else {
      stemsBox.innerHTML = "<em>No complexity selected.</em>";
    }

    updateProgress();
  }

  // copy report to clipboard
  async function copyReportToClipboard() {
    let text = `Research question (draft):\n${state.draft || "(none)"}\n\n`;
    text += `Topic: ${state.topic}\nLens: ${state.lens}\nStakeholders: ${state.stakeholders.join(", ")}\nLocation: ${state.location}\nTime frame: ${state.timeframe}\nAspect: ${state.aspect}\nComplexity: ${state.complexityKey ? COMPLEXITY[state.complexityKey].label : "(none)"}\nNotes: ${state.complexityNote || "(none)"}\n\nSuggested stems:\n`;
    if (state.complexityKey) {
      text += `${COMPLEXITY[state.complexityKey].definition}\n${COMPLEXITY[state.complexityKey].example}`;
    } else {
      text += STEM_TEMPLATES.join("\n");
    }
    try {
      await navigator.clipboard.writeText(text);
      alert("Report copied to clipboard.");
    } catch (err) {
      alert("Unable to copy — your browser might block clipboard access. You can select text in the report and copy manually.");
    }
  }

  // ====== Wiring UI ======
  function wireUI() {
    // step navigation
    $("btnToStep2").onclick = () => {
      const t = $("topicInput").value.trim();
      const l = $("lensSelect").value;
      if (!t || !l) { alert("Enter a topic and pick a lens to proceed."); return; }
      state.topic = t; state.lens = l;
      showLensGuidance();
      updateProgress();
      showStep(2);
    };

    $("btnBackTo1").onclick = () => showStep(1);
    // step2
    $("btnToStep3").onclick = () => {
      const s = [ $("stake1").value.trim(), $("stake2").value.trim(), $("stake3").value.trim(), $("stake4").value.trim() ].filter(Boolean);
      if (s.length === 0) { alert("Please enter at least one stakeholder."); return; }
      state.stakeholders = s;
      updateProgress();
      showStep(3);
    };
    $("btnBackTo2").onclick = () => showStep(2);

    // step3
    $("btnToStep4").onclick = () => {
      const loc = $("locationInput").value.trim();
      if (!loc) { alert("Please enter a location or focus area."); return; }
      state.location = loc; updateProgress();
      showStep(4);
    };
    $("btnBackTo3").onclick = () => showStep(3);

    // step4
    $("btnToStep5").onclick = () => {
      const tf = $("timeInput").value.trim();
      if (!tf) { alert("Please enter a time frame."); return; }
      state.timeframe = tf; updateProgress();
      // load lens guidance in aspect step
      showLensGuidance();
      showStep(5);
    };
    $("btnBackTo4").onclick = () => showStep(4);

    // step5
    $("btnToStep6").onclick = () => {
      const aspect = $("aspectInput").value.trim();
      if (!aspect) { alert("Please enter a specific aspect of the problem to focus on."); return; }
      state.aspect = aspect; updateProgress();
      renderStems();
      showStep(6);
    };
    $("btnBackTo5").onclick = () => showStep(5);

    // step6
    $("btnToStep7").onclick = () => {
      const d = $("draftInput").value.trim();
      if (!d) { alert("Please write a first draft of your research question (must be your own writing)."); return; }
      state.draft = d; updateProgress();
      renderComplexityButtons();
      showStep(7);
    };
    $("btnBackTo6").onclick = () => showStep(6);

    // step7
    $("btnFinish").onclick = () => {
      const note = $("complexExplain").value.trim();
      state.complexityNote = note;
      if (!state.complexityKey) { alert("Please select a complexity type."); return; }
      state.complexityNote = note;
      renderReport();
      showStep(8);
    };
    $("btnBackTo7").onclick = () => showStep(7);

    // final buttons
    $("btnRestart").onclick = () => location.reload();
    $("btnCopy").onclick = copyReportToClipboard;
  }

  function showStep(n) {
    // hide all steps (1..8)
    for (let i=1;i<=8;i++){
      const el = $(`step-${i}`);
      if (el) el.classList.add("hidden");
    }
    const active = $(`step-${n}`);
    if (active) active.classList.remove("hidden");
    updateProgress();
  }

  // initial boot
  function init() {
    wireUI();
    showStep(1);
    updateProgress();
  }

  // start
  document.addEventListener("DOMContentLoaded", init);
})();
