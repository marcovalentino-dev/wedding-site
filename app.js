// ----------------------------
// CONFIG (Sostituisci qui rapidamente senza cercare nel markup)
// ----------------------------
const CONFIG = {
  weddingDate: "30 Settembre 2026",
  rsvpDeadline: "30/09",
  churchName: "Nome Chiesa",
  churchAddress: "CHIESA_ADDRESS",
  churchTime: "ORE (es. 16:00)",
  venueName: "Hotel San Francesco al Monte",
  venueAddress: "C.so Vittorio Emanuele, 328, 80135 Napoli NA",
  venueTime: "ORE (es. 19:00)",
  iban: "IT00 X000 0000 0000 0000 0000 000"
};

// Hydrate placeholders
const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

function hydrateAll() {
  setText("weddingDate", CONFIG.weddingDate);
  setText("weddingDateMini", CONFIG.weddingDate);
  setText("rsvpDeadline", CONFIG.rsvpDeadline);
  setText("churchName", CONFIG.churchName);
  setText("churchName2", CONFIG.churchName);
  setText("churchAddress", CONFIG.churchAddress);
  setText("churchAddress2", CONFIG.churchAddress);
  setText("venueName", CONFIG.venueName);
  setText("venueAddress", CONFIG.venueAddress);
  setText("venueAddress2", CONFIG.venueAddress);
  setText("churchTime", CONFIG.churchTime);
  setText("venueTime", CONFIG.venueTime);
  setText("iban", CONFIG.iban);
  setText("year", new Date().getFullYear());

  // Landing mini fields
  setText("weddingDateMini2", CONFIG.weddingDate);
  setText("weddingDate2", CONFIG.weddingDate);
  setText("churchTime2", CONFIG.churchTime);
  setText("venueTime2", CONFIG.venueTime);
  setText("churchName3", CONFIG.churchName);
  setText("venueName2", CONFIG.venueName);
}

hydrateAll();

// ----------------------------
// LANDING ANIMATION -> mostra sito
// ----------------------------
const landing = document.getElementById("landing");
const site = document.getElementById("site");
const wax = document.getElementById("wax");
const envelope = document.getElementById("envelope");
const skipLanding = document.getElementById("skipLanding");
const landingMsg = document.getElementById("landingMsg");

let opened = false;

function showSite() {
  if (!landing || !site) return;

  landing.classList.add("fade-out");
  site.classList.add("visible");
  site.setAttribute("aria-hidden", "false");

  // dopo la dissolvenza, rimuovi landing dal DOM per accessibilità
  setTimeout(() => {
    landing.classList.add("hidden");
  }, 750);

  // start reveals
  initReveals();
}

function openInvitation() {
  if (opened) return;
  opened = true;

  if (landingMsg) landingMsg.textContent = "✨ Aprendo l’invito…";
  landing.classList.add("is-opening");

  // sequenza: crack + flap + card out, poi entra sito
  // tempi allineati al CSS
  setTimeout(() => {
    if (landingMsg) landingMsg.textContent = "Benvenuti 💛";
  }, 650);

  setTimeout(() => {
    showSite();
    // scroll al top del sito (hero)
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  }, 1650);
}

wax?.addEventListener("click", openInvitation);
envelope?.addEventListener("click", (e) => {
  // clic sulla busta apre anche (comodo su mobile)
  if (e.target === wax) return;
  openInvitation();
});

// accessibilità: enter/space sulla busta
envelope?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openInvitation();
  }
});

skipLanding?.addEventListener("click", () => {
  opened = true;
  showSite();
  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
});

// ----------------------------
// SITO: Landing “Apri l’invito” dentro hero
// ----------------------------
const openSiteBtn = document.getElementById("openSiteBtn");
const scrollProgramBtn = document.getElementById("scrollProgramBtn");
const heroLetter = document.querySelector(".letter");

function goToProgramma() {
  // piccola animazione prima dello scroll
  heroLetter?.classList.add("fadeout");
  setTimeout(() => {
    document.getElementById("programma")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => heroLetter?.classList.remove("fadeout"), 900);
  }, 350);
}

openSiteBtn?.addEventListener("click", goToProgramma);
scrollProgramBtn?.addEventListener("click", () => {
  document.getElementById("programma")?.scrollIntoView({ behavior: "smooth" });
});

// Nav CTA
document.getElementById("navRsvpBtn")?.addEventListener("click", () => {
  document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
});

// ----------------------------
// Mobile menu
// ----------------------------
const sheet = document.getElementById("sheet");
const burger = document.getElementById("burger");
const closeSheet = document.getElementById("closeSheet");
const sheetLinks = document.querySelectorAll(".sheetLink");

const openSheet = () => sheet?.classList.add("open");
const hideSheet = () => sheet?.classList.remove("open");

burger?.addEventListener("click", openSheet);
closeSheet?.addEventListener("click", hideSheet);
sheet?.addEventListener("click", (e) => { if (e.target === sheet) hideSheet(); });
sheetLinks.forEach(a => a.addEventListener("click", () => setTimeout(hideSheet, 120)));

// ----------------------------
// Reveal on scroll (animazioni eleganti)
// (inizializzato dopo la landing per evitare lavoro inutile)
// ----------------------------
let io = null;
function initReveals(){
  const reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("in"));
    return;
  }
  io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14 });
  reveals.forEach(el => io.observe(el));
}

// Se qualcuno disattiva la landing (es. via CSS) mostriamo comunque le reveal:
if (site.classList.contains("visible")) initReveals();

// ----------------------------
// RSVP logic: gestione +1 dinamici
// ----------------------------
const numPersone = document.getElementById("numPersone");
const plusContainer = document.getElementById("plusContainer");
const plusList = document.getElementById("plusList");
const addPlus = document.getElementById("addPlus");
const partecipantiHidden = document.getElementById("partecipanti");

const plusInputs = []; // { value }

function renderPlus(){
  if(!plusList) return;
  plusList.innerHTML = "";
  plusInputs.forEach((p, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "pill";
    wrapper.innerHTML = `
      <div style="flex:1">
        <div style="display:flex; align-items:center; gap:8px">
          <b>+${idx+1}</b>
          <small>Nome e Cognome</small>
        </div>
        <input aria-label="Nome e cognome +${idx+1}" placeholder="Es. Marco Rossi" style="margin-top:8px" />
      </div>
      <button type="button" aria-label="Rimuovi +${idx+1}">Rimuovi</button>
    `;
    const input = wrapper.querySelector("input");
    const btn = wrapper.querySelector("button");
    input.value = p.value || "";
    input.addEventListener("input", () => { p.value = input.value; syncPartecipanti(); });
    btn.addEventListener("click", () => {
      plusInputs.splice(idx, 1);
      renderPlus();
      syncPartecipanti();
    });
    plusList.appendChild(wrapper);
  });
  syncPartecipanti();
}

function syncPartecipanti(){
  if(!partecipantiHidden) return;
  const nome = document.getElementById("nome")?.value || "";
  const cognome = document.getElementById("cognome")?.value || "";
  const me = `${nome} ${cognome}`.trim();
  const others = plusInputs.map(p => (p.value || "").trim()).filter(Boolean);
  const all = [me, ...others].filter(Boolean);
  partecipantiHidden.value = all.join(" | ");
}

function desiredPlusCount(){
  const n = parseInt(numPersone?.value || "0", 10);
  if(!Number.isFinite(n) || n <= 1) return 0;
  return n - 1;
}

function ensurePlusFields(){
  const need = desiredPlusCount();
  if(!plusContainer) return;

  if(need <= 0){
    plusInputs.length = 0;
    plusContainer.style.display = "none";
    renderPlus();
    return;
  }
  plusContainer.style.display = "block";
  while(plusInputs.length < need) plusInputs.push({ value: "" });
  while(plusInputs.length > need) plusInputs.pop();
  renderPlus();
}

numPersone?.addEventListener("change", ensurePlusFields);
addPlus?.addEventListener("click", () => {
  if(!plusContainer) return;
  plusContainer.style.display = "block";
  plusInputs.push({ value: "" });
  renderPlus();
  const newTotal = plusInputs.length + 1;
  if(newTotal <= 6 && numPersone) numPersone.value = String(newTotal);
});

["nome","cognome"].forEach(id => document.getElementById(id)?.addEventListener("input", syncPartecipanti));

// ----------------------------
// Form submit: validazione e messaggio. (Non invia davvero se action="#")
// ----------------------------
const form = document.getElementById("rsvpForm");
const formMsg = document.getElementById("formMsg");

function validate(){
  const requiredIds = ["nome","cognome","contatto","adesione","numPersone"];
  let ok = true;
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    const bad = !String(el.value || "").trim();
    if(bad){
      ok = false;
      el.style.borderColor = "rgba(229,154,164,.75)";
    } else {
      el.style.borderColor = "rgba(184,146,74,.22)";
    }
  });
  return ok;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if(formMsg) formMsg.textContent = "";
  syncPartecipanti();

  if(!validate()){
    if(formMsg) formMsg.textContent = "Controlla i campi obbligatori evidenziati.";
    return;
  }

  const action = form.getAttribute("action");
  if(!action || action === "#"){
    if(formMsg) formMsg.textContent = "✅ Perfetto! (Demo) Collega un endpoint per inviare davvero la RSVP.";
    form.reset();
    plusInputs.length = 0;
    ensurePlusFields();
    return;
  }

  try{
    const data = new FormData(form);
    const res = await fetch(action, { method: "POST", body: data, headers: { "Accept": "application/json" } });
    if(res.ok){
      if(formMsg) formMsg.textContent = "✅ RSVP inviata! Grazie!";
      form.reset();
      plusInputs.length = 0;
      ensurePlusFields();
    } else {
      if(formMsg) formMsg.textContent = "⚠️ Qualcosa non ha funzionato. Riprova o contattaci.";
    }
  } catch(err){
    if(formMsg) formMsg.textContent = "⚠️ Errore di rete. Riprova tra poco.";
  }
});

// ----------------------------
// Copy IBAN
// ----------------------------
const copyBtn = document.getElementById("copyIban");
const copyMsg = document.getElementById("copyMsg");
copyBtn?.addEventListener("click", async () => {
  const text = document.getElementById("iban")?.textContent?.trim() || "";
  try{
    await navigator.clipboard.writeText(text);
    if(copyMsg) copyMsg.textContent = "Copiato!";
    setTimeout(() => { if(copyMsg) copyMsg.textContent = ""; }, 1400);
  } catch {
    if(copyMsg) copyMsg.textContent = "Seleziona e copia manualmente.";
    setTimeout(() => { if(copyMsg) copyMsg.textContent = ""; }, 1800);
  }
});

// Init
ensurePlusFields();
