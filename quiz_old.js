// 1) Lista de etapas (ordem do quiz)
const STEPS = [
  window.STEP_INTRO,
  window.STEP_01,
  window.STEP_02
  window.STEP_PROGRESS_01
];

// 2) Checkout Hotmart (depois a gente coloca o seu)
const HOTMART_LINK = "https://pay.hotmart.com/SEULINK?src=quiz_lipedema";

let stepIndex = 0;
const answers = {};

const screen = document.getElementById("screen");
const bar = document.getElementById("bar");
const nav = document.getElementById("nav");
const backBtn = document.getElementById("back");
const nextBtn = document.getElementById("next");

function setProgress() {
  // não conta intro como progresso de perguntas
  const total = STEPS.length - 1;
  const current = Math.max(0, stepIndex - 1);
  const pct = total <= 0 ? 0 : Math.round((current / total) * 100);
  bar.style.width = pct + "%";
}

function goNext() {
  if (stepIndex < STEPS.length - 1) {
    stepIndex++;
    render();
  } else {
    window.location.href = HOTMART_LINK;
  }
}

function goBack() {
  if (stepIndex > 0) {
    stepIndex--;
    render();
  }
}

function renderIntro(step) {
  nav.style.display = "none";
  screen.innerHTML = `
    <div style="text-align:center">
      <div class="q">${step.title}</div>
      <p>${step.subtitle}</p>
      ${step.image ? `<img src="${step.image}" style="width:100%;border-radius:16px;margin:16px 0">` : ""}
      <button class="opt btnPrimary" id="startBtn">${step.buttonText}</button>
      <div class="alert" style="margin-top:14px">${step.alertHtml || ""}</div>
    </div>
  `;
  document.getElementById("startBtn").onclick = () => goNext();
}

function renderQuestion(step) {
  nav.style.display = "none"; // seu fluxo é 1 clique por etapa
  screen.innerHTML = `
    <div class="q">${step.text}</div>
    <div>
      ${step.options.map(o => `<button class="opt btnPrimary" data-opt="${encodeURIComponent(o)}">${o}</button>`).join("")}
    </div>
  `;
  document.querySelectorAll("[data-opt]").forEach(btn => {
    btn.onclick = () => {
      const opt = decodeURIComponent(btn.getAttribute("data-opt"));
      answers[step.id] = opt;
      goNext();
    };
  });
}
let activeTimer = null;

function clearActiveTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}

function renderProgress(step) {
  nav.style.display = "none";
  clearActiveTimer();

  screen.innerHTML = `
    <div style="max-width:520px;margin:80px auto 0; text-align:left;">
      <div style="font-weight:800;margin-bottom:10px;">
        ${step.title}
      </div>

      <div class="progress" style="height:10px;">
        <div class="bar" id="progressBar" style="width:0%;height:10px"></div>
      </div>

      <div style="display:flex; justify-content:space-between; font-size:12px; color:#777; margin-top:8px;">
        <div>${step.subtitle}</div>
        <div id="progressPct">0%</div>
      </div>
    </div>
  `;

  const barEl = document.getElementById("progressBar");
  const pctEl = document.getElementById("progressPct");

  const start = Date.now();
  const duration = step.durationMs || 5000;

  activeTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.round((elapsed / duration) * 100));

    barEl.style.width = pct + "%";
    pctEl.textContent = pct + "%";

    if (pct >= 100) {
      clearActiveTimer();
      goNext();
    }
  }, 50);
}

function render() {
  clearActiveTimer();
  setProgress();

  const step = STEPS[stepIndex];

  if (step.type === "intro") return renderIntro(step);
  if (step.type === "question") return renderQuestion(step);
  if (step.type === "progress") return renderProgress(step);

  screen.innerHTML = `<div class="q">Etapa não reconhecida: ${step.type}</div>`;
}


backBtn.onclick = goBack;
nextBtn.onclick = goNext;

render();
