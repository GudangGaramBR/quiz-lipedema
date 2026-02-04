// Lista de etapas (ordem do quiz)
const STEPS = [
  
  // 1 — Intro
  window.STEP_INTRO,

  // 2 a 4 — Diagnóstico inicial
  window.STEP_02_AGUA,
  window.STEP_03_RUTINA,
  window.STEP_04_ESTAGIOS,

  // 5 a 7 — Educação inicial
  window.STEP_05_NOTICIA,
  window.STEP_06_ALIMENTOS,
  window.STEP_07_SABIAS,

  // 8 — VSL 1
  window.STEP_VIDEO_01,

  // 9 a 16 — Perguntas de aprofundamento
  window.STEP_09_CONVIVES,
  window.STEP_10_FRECUENCIA,
  window.STEP_11_DOLOR,
  window.STEP_12_RESTRICCION,
  window.STEP_13_ROPAS,
  window.STEP_14_HINCHAZON,
  window.STEP_15_AL_TOCAR,
  window.STEP_16A_MARCAS_IMG,

  // 17 — VSL 2
  window.STEP_VIDEO_02,

  // 18 a 21 — Intenção e preparação
  window.STEP_18_PROXIMAS_PREGUNTAS,
  window.STEP_19_TE_GUSTARIA,
  window.STEP_20_QUIERES,
  window.STEP_21_TODO_NECESITA,

  // 22 — Carregamento 1
  window.STEP_22_CARREGAMENTO_1,

  // 23 a 27 — Resultado + persuasão
  window.STEP_23_RESULTADO,
  window.STEP_24_NADA_FUNCIONA,
  window.STEP_25_CONOZCA,
  window.STEP_26_DESEA,
  window.STEP_27_SUCEDE,

  // 28 — Carregamento final
  window.STEP_28_CARREGAMENTO_2,

  // 29 — Oferta final
  window.STEP_FINAL_OFFER
];

// ===== MODO EDIÇÃO =====
// true  = sem delays (pra configurar tudo rápido)
// false = delays normais (produção)
const EDIT_MODE_NO_DELAYS = false;


let stepIndex = 0;
const answers = {};
let activeTimer = null;

const screen = document.getElementById("screen");
const barTop = document.getElementById("bar"); // barra roxa do topo

function clearActiveTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}

function setTopProgress() {
  // ignora intro no cálculo
  const total = STEPS.length - 1;
  const current = Math.max(0, stepIndex - 1);
  const pct = total <= 0 ? 0 : Math.round((current / total) * 100);
  if (barTop) barTop.style.width = pct + "%";
}

function goNext() {
  if (stepIndex < STEPS.length - 1) {
    stepIndex++;
    render();
  } else {
    // FINAL DO QUIZ → REDIRECT AUTOMÁTICO
    const checkoutUrl = buildHotmartUrl(
      "https://pay.hotmart.com/W104185322U?off=2u7mji07&checkoutMode=10",
      "quiz_lipedema"
    );

    window.location.href = checkoutUrl; // mesma aba
  }
}



function renderIntro(step) {
  screen.innerHTML = `
    <div style="text-align:center">
      <div class="q">${step.title}</div>
      <p>${step.subtitle}</p>
      ${step.image ? `<img src="${step.image}" style="width:100%;border-radius:16px;margin:16px 0">` : ""}
      <button class="opt btnPrimary ctaPulse" id="startBtn">${step.buttonText}</button>
      <div class="alert" style="margin-top:14px">${step.alertHtml || ""}</div>
    </div>
  `;
  document.getElementById("startBtn").onclick = goNext;
}

function renderQuestion(step) {
  const options = Array.isArray(step.options) ? step.options : [];

  const isObjectOptions = options.length && typeof options[0] === "object";
  const isGridImageOptions = isObjectOptions && options.some(o => !!o.image);

  screen.innerHTML = `
    <div style="text-align:center">
      <div class="q" style="margin-bottom:6px;">${step.text}</div>
      ${step.subtitle ? `<div class="qSub">${step.subtitle}</div>` : ""}


      <div class="${isGridImageOptions ? "optionsGrid2" : ""}" style="text-align:left;">
        ${options.map((o) => {
          // 1) opções simples (string) → botões roxos (compatível)
          if (!isObjectOptions) {
            return `<button class="opt btnPrimary" data-opt="${encodeURIComponent(o)}">${o}</button>`;
          }

          // 2) grid com imagem (2 colunas)
          if (isGridImageOptions) {
            const value = o.value ?? o.label;
            return `
              <button class="gridCard" data-opt="${encodeURIComponent(value)}">
                <div class="gridImgWrap">
                  <img class="gridImg" src="${o.image}" alt="">
                </div>
                <div class="gridLabel">${o.label}</div>
                ${o.desc ? `<div class="gridDesc">${o.desc}</div>` : ""}
              </button>
            `;
          }

          // 3) card normal com ícone + descrição (1 coluna)
          const value = o.value ?? o.label;
          return `
            <button class="opt optionCard" data-opt="${encodeURIComponent(value)}">
              <div class="optionIcon">${o.icon || ""}</div>
              <div class="optionText">
                <div class="optionLabel">${o.label}</div>
                ${step.showOptionDesc === false ? "" : (o.desc ? `<div class="optionDesc">${o.desc}</div>` : "")}
              </div>
            </button>
          `;
        }).join("")}
      </div>
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

function renderResult(step) {
  const bars = Array.isArray(step.bars) ? step.bars : [];

  // imagens
  const circleImg = step.resultImageTop  || "images/resultado1.webp";
  const legsImg   = step.resultImageBody || "images/resultado2.webp";

  screen.innerHTML = `
    <div style="text-align:center">

      <div style="font-weight:800; font-size:18px; margin:8px 0 6px;">
        ${step.titleTop || "Aquí está el resultado de su consulta:"}
      </div>

      

      <div style="display:flex; justify-content:center; margin:0 0 16px;">
        <img 
  src="${circleImg}" 
  style="
    width: min(460px, 95vw);
    height: auto;
    margin: 8px auto 12px;
    display: block;
  " 
  alt=""
>

      </div>

      <div style="max-width:560px; margin:0 auto 18px; background:#ffecec; color:#b00000; padding:14px; border-radius:14px; text-align:left;">
        <div style="font-weight:900; margin-bottom:6px;">
          ${step.resultTitle || "Resultado:"}
        </div>
        <div style="font-size:15px; line-height:1.45;">
          ${step.resultText || "Preocupante, necesita actuar rápidamente!"}
        </div>
      </div>

      <div style="max-width:560px; margin:0 auto; text-align:left;">
        ${bars.map(b => `
          <div style="margin:16px 0;">
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div style="font-weight:800;">${b.label}</div>
              <div style="color:#888; font-weight:700;">${b.value}%</div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:12px; margin:6px 0 8px;">
              <span>Bajo</span><span>Medio</span><span>Alto</span>
            </div>

            <div style="position:relative; height:6px; border-radius:999px; background:linear-gradient(90deg,#2ecc71,#f1c40f,#e74c3c);">
              <div style="
                position:absolute;
                left:calc(${Math.max(2, Math.min(98, b.value))}%);
                top:-34px;
                transform:translateX(-50%);
                text-align:center;
              ">
                <div style="
                  background:#111;
                  color:#fff;
                  font-size:11px;
                  padding:2px 8px;
                  border-radius:8px;
                  display:inline-block;
                ">Tú</div>

                <div style="
                  width:12px;
                  height:12px;
                  border-radius:50%;
                  border:3px solid #7b3fe4;
                  background:#fff;
                  margin:6px auto 0;
                "></div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <div style="display:flex; justify-content:center; margin:16px 0 10px;">
        <img src="${legsImg}" style="width:260px; max-width:85%; height:auto;" alt="">
      </div>

      <div style="max-width:560px; margin:10px auto 12px; background:#dff7e7; border-radius:14px; padding:16px; text-align:left;">
        <div style="font-weight:900; margin-bottom:8px; font-size:16px;">
          🟢 ${step.greenTitle || "Tiene un perfil adecuado para la realización del Protocolo Lipedema Reset 28D."}
        </div>
        <div style="font-size:15px; line-height:1.5;">
          ${step.greenText || "De acuerdo con sus respuestas, encontramos que está lista para desinflamar su lipedema a través de una alimentación natural y suplementos antilipedema, sin el uso de medicamentos o de cirugías."}
        </div>
      </div>

      <button class="opt btnPrimary ctaPulse" id="resultCta">
        ${step.ctaText || "¡QUIERO SABER MÁS! 😍"}
      </button>

    </div>
  `;

  document.getElementById("resultCta").onclick = goNext;
}





function renderQuestionWithTopImage(step) {
  const options = Array.isArray(step.options) ? step.options : [];

  screen.innerHTML = `
    <div style="text-align:center">
      <div class="q" style="margin-bottom:6px;">${step.text}</div>
      ${step.subtitle ? `<p style="margin-top:0; margin-bottom:14px;">${step.subtitle}</p>` : ""}

      ${step.image ? `
        <div class="topQuestionImageWrap">
          <img class="topQuestionImage" src="${step.image}" alt="">
        </div>
      ` : ""}

      <div style="margin-top:12px; text-align:left;">
        ${options.map((o) => {
          const value = o.value ?? o.label ?? "";
          return `
            <button class="opt optionCard" data-opt="${encodeURIComponent(value)}">
              <div class="optionIcon">${o.icon || ""}</div>
              <div class="optionText">
                <div class="optionLabel">${o.label || ""}</div>
                ${o.desc ? `<div class="optionDesc">${o.desc}</div>` : ""}
              </div>
            </button>
          `;
        }).join("")}
      </div>
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


function renderProgress(step) {
  clearActiveTimer();

  screen.innerHTML = `
    <div style="max-width:520px;margin:80px auto 0; text-align:left;">
      <div style="font-weight:800;margin-bottom:10px;">${step.title}</div>

      <div class="progress" style="height:10px;">
        <div class="bar" id="progressBar" style="height:10px;width:0%"></div>
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

function loadScriptOnce(src, id, cb) {
  const existing = document.getElementById(id);

  // se já existe, considera pronto e chama callback
  if (existing) {
    cb && cb();
    return;
  }

  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  s.onload = () => cb && cb();
  document.head.appendChild(s);
}


function renderVideo(step) {
  clearActiveTimer();
  setTopProgress();

  const DEFAULT_DELAY_SECONDS = 10;

  const disableDelay = EDIT_MODE_NO_DELAYS || step.noDelay === true;

  const delaySeconds = disableDelay
    ? 0
    : (Number(step.delaySeconds) > 0 ? Number(step.delaySeconds) : DEFAULT_DELAY_SECONDS);

  screen.innerHTML = `
    <div style="text-align:center">
      <div class="q" style="margin-bottom:6px;">${step.title || ""}</div>
      ${step.subtitle ? `<div class="qSub">${step.subtitle}</div>` : ""}

      <div class="videoCard" id="videoMount"></div>

      <!-- BOTÃO COMEÇA OCULTO -->
      <button class="opt btnPrimary ctaPulse" id="videoContinue" style="display:none;">
        ${step.buttonText || "CONTINUAR CONSULTA"}
      </button>


    </div>
  `;

  // ---- MONTA PLAYER VTURB ----
  const mount = document.getElementById("videoMount");
  const playerDomId = "vid-" + step.vturbSmartPlayerId;

  mount.innerHTML = `
    <vturb-smartplayer
      id="${playerDomId}"
      style="display:block; margin:0 auto; width:100%; max-width:${step.maxWidth || 400}px;"
    ></vturb-smartplayer>
  `;

  // Reinjetar script (cache buster)
  const scriptId = "vturb_script_" + step.vturbSmartPlayerId;
  const old = document.getElementById(scriptId);
  if (old) old.remove();

  const s = document.createElement("script");
  s.id = scriptId;
  const cacheBuster = "cb=" + Date.now();
  s.src = step.vturbScriptSrc + (step.vturbScriptSrc.includes("?") ? "&" : "?") + cacheBuster;
  s.async = true;
  document.head.appendChild(s);

  // ---- BOTÃO CONTINUAR (SÓ APARECE DEPOIS DO DELAY) ----
  const btn = document.getElementById("videoContinue");
  const hint = document.getElementById("delayHint");

  btn.onclick = goNext;

  // Sem delay: mostra na hora
  if (delaySeconds <= 0) {
    btn.style.display = "flex"; // fica centralizado como teus botões
    if (hint) hint.textContent = "";
    return;
  }

  let remaining = delaySeconds;
  if (hint) hint.textContent = `Podrás continuar en ${remaining}s…`;

  activeTimer = setInterval(() => {
    remaining -= 1;

    if (remaining > 0) {
      if (hint) hint.textContent = `Podrás continuar en ${remaining}s…`;
      return;
    }

    clearActiveTimer();
    btn.style.display = "flex"; // aparece aqui
    if (hint) hint.textContent = "";
  }, 1000);
}








function renderEducation(step) {
  clearActiveTimer();
  setTopProgress();

  // suporte a 1 imagem ou várias
  let imagesHtml = "";

  if (Array.isArray(step.images)) {
    imagesHtml = step.images.map(src => `
      <div style="margin:12px 0;">
        <img src="${src}" style="width:100%;border-radius:14px;border:1px solid #eee;">
      </div>
    `).join("");
  } else if (step.image) {
  imagesHtml = `
    <div class="mediaCard">
      <img src="${step.image}" class="mediaImg">
    </div>
  `;
}

  const textHtml = (step.text || "").trim();


  screen.innerHTML = `
  <div class="edu ${step.variant ? "edu-" + step.variant : ""}" style="text-align:center">
    ${step.title ? `<div class="eduTitle">${step.title}</div>` : ""}

    <div class="eduText">
      ${textHtml}
    </div>

    ${imagesHtml}

    <button class="opt btnPrimary ctaPulse" id="eduContinue">
      ${step.buttonText || "CONTINUAR"}
    </button>
  </div>
`;


  document.getElementById("eduContinue").onclick = goNext;
}





// Monta URL do checkout Hotmart + src + UTMs (mesma aba)
function buildHotmartUrl(baseUrl, srcValue) {
  const out = new URL(baseUrl);

  // src = origem do clique
  if (srcValue) out.searchParams.set("src", srcValue);

  // preservar UTMs (se vierem do anúncio)
  const inUrl = new URL(window.location.href);
  ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(k => {
    const v = inUrl.searchParams.get(k);
    if (v) out.searchParams.set(k, v);
  });

  return out.toString();
}

function renderOffer(step) {
  clearActiveTimer();

  screen.innerHTML = `
    <div style="text-align:left">
      <div class="q">${step.title}</div>
      ${step.subtitle ? `<p>${step.subtitle}</p>` : ""}

      ${step.bullets && step.bullets.length ? `
        <div style="margin:16px 0; padding:14px; border:1px solid #eee; border-radius:14px;">
          <div style="font-weight:800; margin-bottom:10px;">Incluye:</div>
          <ul style="margin:0; padding-left:18px; line-height:1.6;">
            ${step.bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      ` : ""}

      <button class="opt btnPrimary ctaPulse" id="goCheckout">${step.ctaText || "QUIERO ACCEDER AHORA"}</button>

      <div style="font-size:12px;color:#777;margin-top:10px;">
        Acceso inmediato. Compra segura.
      </div>
    </div>
  `;

  document.getElementById("goCheckout").onclick = () => {
    const url = buildHotmartUrl(step.hotmartUrl, step.src || "quiz_lipedema");
    window.location.href = url; // mesma aba
  };
}



function render() {
  clearActiveTimer();
  setTopProgress();

  const step = STEPS[stepIndex];

  // Airbag: evita tela branca se alguma etapa não carregou
  if (!step) {
    screen.innerHTML = `<div class="q">Etapa inexistente (stepIndex=${stepIndex}).</div>`;
    return;
  }

  if (step.type === "intro") return renderIntro(step);
  if (step.type === "question_image") return renderQuestionWithTopImage(step);
if (step.type === "question") return renderQuestion(step);

  if (step.type === "video") return renderVideo(step);
  if (step.type === "education") return renderEducation(step);
  if (step.type === "progress") return renderProgress(step);
  if (step.type === "result") return renderResult(step);
  if (step.type === "final_offer") return renderFinalOffer(step);
  

  screen.innerHTML = `<div class="q">Tipo de etapa desconhecido: ${step.type}</div>`;
  
}

function renderFinalOffer(step) {
  clearActiveTimer();
  setTopProgress();

  screen.innerHTML = `
  <div style="text-align:center">
    <div style="max-width:620px; margin:0 auto; padding:0 16px;">



     <div style="font-weight:900; font-size:28px; line-height:1.15; margin:10px 0 12px;">
      ¡Protocolo personalizado generado con éxito!
      </div>


      <div style="font-size:16px; color:#333; max-width:560px; margin:0 auto 16px; line-height:1.55;">
        Analizando su perfil, desarrollamos un método personalizado para eliminar la grasa inflamada de las piernas de forma eficaz.
      </div>

      <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin:16px 0 14px;">
  <div style="
    display:inline-flex; align-items:center; gap:8px;
    background:#e53935; color:#fff;
    font-weight:900; font-size:16px;
    padding:10px 14px; border-radius:8px;
  ">
    ❌ Antes del protocolo
  </div>

  <div style="
    display:inline-flex; align-items:center; gap:8px;
    background:#1e9b4b; color:#fff;
    font-weight:900; font-size:16px;
    padding:10px 14px; border-radius:8px;
  ">
    ✅ Después de 22 días
  </div>
</div>


      <div style="margin:8px auto 16px; max-width:560px;">
  <img src="${step.heroImage}" style="width:100%; border-radius:16px; border:1px solid #eee; display:block;" />
</div>


      <!-- Barras/indicadores (simplificado e fiel ao visual) -->
      <div style="max-width:520px; margin:0 auto; text-align:left; font-size:13px;">
        ${progressRow("Hinchazón", "Constante", "Reducida", 90, 10)}
${progressRow("Dolores", "Todos los días", "Desapareciendo", 85, 5)}
${progressRow("Autoestima", "Muy baja", "Elevada", 10, 95)}
${progressRow("Resultados", "Ningún cambio visible", "Visibles en 21 días", 5, 97)}
${progressRow("Energía", "Siempre cansada", "Alta y constante", 15, 92)}
      </div>

      <div style="
  max-width:560px;
  margin:16px auto 0;
  background:#f3f4f6;
  border-radius:16px;
  padding:16px 14px;
  text-align:center;
">
  <div style="font-weight:900; font-size:20px; line-height:1.25; margin:4px 0 14px;">
    🟢 Beneficios que vas a tener al adquirir el<br/>
    Protocolo Lipedema: Adiós en 22 Días
  </div>

  ${benefitRow("✅", "Clases en video con orientación médica",
    "Aprendé a implementar el plan paso a paso, desde tu casa, con explicaciones simples y seguras.")}

  ${benefitRow("✅", "Protocolo Alimentario Antiinflamatorio",
    "Menú nutricional y práctico para 28 días: comidas simples que reducen inflamación y mejoran tu circulación.")}

  ${benefitRow("🛒", "Lista VIP de compras saludables",
    "Comprá con estrategia y sin gastar de más: todo lo que necesitás para 28 días organizado por categorías.")}

  ${benefitRow("🗓️", "Planner semanal personalizado",
    "Organizá tu rutina con claridad y consistencia: cronograma diario de alimentación, hidratación, movimiento y autocuidado. Listo para imprimir o usar en tu celular.")}

</div>

      </div>

      <div style="
  max-width:560px;
  margin:18px auto;
  background:#fff4c7;
  border-radius:16px;
  padding:18px 16px;
  text-align:center;
">

  <div style="font-weight:900; font-size:18px; margin-bottom:14px;">
    Resumen de lo que vas a recibir
  </div>

  <div style="text-align:left; max-width:520px; margin:0 auto; font-size:14px; line-height:1.55; color:#6b4b00;">

    ${resumeItem("🟦", "Protocolo Lipedema: Adiós en 22 Días",
      "Guía médica y práctica para entender, controlar y mejorar el lipedema con alimentación, hidratación y hábitos diarios",
      "USD 97")}

    ${resumeItem("🗓️", "Planner semanal 22 días",
      "Organizá tu rutina y haz un seguimiento fácil",
      "USD 37")}

    ${resumeItem("✅", "Dieta antiinflamatoria",
      "Qué comer y qué evitar siempre a mano",
      "USD 27")}

    ${resumeItem("🛒", "Lista VIP de compras saludables",
      "Todo lo que necesitas para tu alimentación",
      "USD 27")}

    ${resumeItem("🎯", "Desafío guiado de 22 días",
      "Hábitos simples y motivación semanal",
      "USD 97")}

  </div>

  <div style="margin:14px 0 10px; color:#d12b2b; font-weight:900; font-size:20px; text-decoration:line-through;">
    Valor real: USD 285
  </div>

  <div style="font-weight:900; font-size:26px; margin:0;">
    Hoy solo:
  </div>

  <div style="font-weight:900; font-size:34px; color:#1e9b4b; margin-top:2px;">
    USD 9,90
  </div>

  <div style="margin-top:10px; font-size:14px; color:#6b4b00; line-height:1.55;">
    Es decir, <b>menos de 0,45 USD por día</b> durante los 22 días del protocolo.
    Menos que un café al día — para transformar cómo te ves y cómo te sientes.
  </div>

</div>


      <button class="opt btnPrimary ctaPulse" id="goCheckout">
  QUIERO GARANTIZAR MI PROTOCOLO LIPEDEMA: ADIÓS EN 22 DÍAS
</button>

      <div style="max-width:520px; margin:14px auto; text-align:left;">
        ${testimonial("Laura Martínez", "Nunca pensé que algo tan simple como seguir este protocolo pudiera cambiar tanto mi vida. En solo 22 días mi dolor bajó, mis piernas se sienten mucho livianas y recuperé la motivación para cuidarme.")}
        ${testimonial("Valentina Gómez", "Siempre me sentí frustrada porque nada funcionaba. Con el Protocolo Lipedema: Adiós en 22 Días aprendí qué comer, cómo moverme y ahora sé controlar la inflamación. Me veo y me siento diferente.")}
        ${testimonial("Camila Rodríguez", "Lo mejor fue tener un plan claro y acompañamiento. No tuve que adivinar nada: todo estaba explicado. Hoy uso ropa que antes no me animaba y mi autoestima subió muchísimo.")}
      </div>


      
     ${step.sealImage ? `
  <div style="margin:26px 0 18px; display:flex; justify-content:center;">
    <img 
      src="${step.sealImage}" 
      style="
        width: min(320px, 92vw) !important;
        height: auto !important;
        max-width: none !important;
        display: block;
      "
      alt="Garantía 7 días"
    />
  </div>
` : ""}



<button class="opt btnPrimary ctaPulse" id="goCheckout2">
  QUIERO ACCEDER AL PROTOCOLO LIPEDEMA: ADIÓS EN 22 DÍAS CON 7 DÍAS DE GARANTÍA
</button>


      <div style="height:10px"></div>
    </div>
    </div>

    

  `;

  const checkoutUrl = buildHotmartUrl(step.hotmartUrl, step.src || "quiz_lipedema");

  document.getElementById("goCheckout").onclick = () => {
    window.location.href = checkoutUrl; // mesma aba
  };
  document.getElementById("goCheckout2").onclick = () => {
    window.location.href = checkoutUrl; // mesma aba
  };
}

// Helpers (coloque junto no quiz.js, 1 vez só)
function progressRow(label, leftText, rightText, leftPct, rightPct) {
  // aceita "90%" ou 90
  const l = typeof leftPct === "string" ? parseInt(leftPct, 10) : leftPct;
  const r = typeof rightPct === "string" ? parseInt(rightPct, 10) : rightPct;

  const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));
  const L = clamp(l);
  const R = clamp(r);

  // cores (igual ao modelo)
  const colorLeft = "#e53935";   // vermelho (antes)
  const colorRight = "#1e9b4b";  // verde (depois)

  return `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin:14px 0;">

      <!-- ANTES -->
      <div style="text-align:left;">
        <div style="font-weight:900; font-size:14px; margin-bottom:4px;">${label}</div>
        <div style="color:#333; font-size:13px; margin-bottom:8px;">${leftText}</div>

        <div style="position:relative; height:8px; background:#e9ecef; border-radius:999px; overflow:hidden;">
          <div style="height:8px; width:${L}%; background:${colorLeft}; border-radius:999px;"></div>

          <!-- bolinha -->
          <div style="
            position:absolute;
            left:calc(${L}% - 8px);
            top:50%;
            transform:translateY(-50%);
            width:16px; height:16px;
            background:#fff;
            border:3px solid ${colorLeft};
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,.15);
          "></div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; color:#666; margin-top:6px;">
          <span>${L}%</span>
          <span></span>
        </div>
      </div>

      <!-- DESPUÉS -->
      <div style="text-align:left;">
        <div style="font-weight:900; font-size:14px; margin-bottom:4px;">${label}</div>
        <div style="color:#333; font-size:13px; margin-bottom:8px;">${rightText}</div>

        <div style="position:relative; height:8px; background:#e9ecef; border-radius:999px; overflow:hidden;">
          <div style="height:8px; width:${R}%; background:${colorRight}; border-radius:999px;"></div>

          <!-- bolinha -->
          <div style="
            position:absolute;
            left:calc(${R}% - 8px);
            top:50%;
            transform:translateY(-50%);
            width:16px; height:16px;
            background:#fff;
            border:3px solid ${colorRight};
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,.15);
          "></div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; color:#666; margin-top:6px;">
          <span>${R}%</span>
          <span></span>
        </div>
      </div>

    </div>
  `;
}


function testimonial(name, text) {
  return `
    <div style="border:1px solid #eee; border-radius:14px; padding:12px; margin:10px 0;">
      <div style="font-weight:800;">⭐⭐⭐⭐⭐</div>
      <div style="font-weight:800; margin-top:6px;">${name}</div>
      <div style="font-size:13px; color:#444; margin-top:6px; line-height:1.45;">${text}</div>
    </div>
  `;
}

function benefitRow(icon, title, desc) {
  return `
    <div style="margin:14px 0 10px;">
      <div style="font-weight:900; font-size:16px; display:flex; gap:10px; justify-content:center; align-items:flex-start;">
        <span style="font-size:18px; line-height:1;">${icon}</span>
        <span>${title}</span>
      </div>
      <div style="margin:8px auto 0; max-width:520px; font-size:15px; line-height:1.6; color:#333;">
        ${desc}
      </div>
    </div>
  `;
}

function resumeItem(icon, title, desc, price) {
  return `
    <div style="margin:10px 0 14px;">
      <div style="font-weight:900; font-size:15px; color:#8a5a00; display:flex; gap:10px; align-items:flex-start;">
        <span style="width:22px; display:inline-block; text-align:center;">${icon}</span>
        <span style="flex:1;">${title}</span>
      </div>

      <div style="margin-left:32px; color:#8a5a00;">
        ${desc} — <b>${price}</b>
      </div>
    </div>
  `;
}



render();
