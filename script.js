/* ═══════════════════════════════════════════════════
   BRANDA.IA — Frontend Logic
   ═══════════════════════════════════════════════════ */

const API_BASE = "http://192.168.100.64:5000";

/* ─── DOM refs ─────────────────────────────────────── */
const form        = document.getElementById("brandForm");
const brandInput  = document.getElementById("brandName");
const requestInput= document.getElementById("userRequest");
const btn         = document.getElementById("analyzeBtn");
const loading     = document.getElementById("loading");
const results     = document.getElementById("results");
const errorMsg    = document.getElementById("errorMsg");

/* ─── Helpers ──────────────────────────────────────── */
function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n;
}

function scoreClass(s) {
  if (s >= 65) return "good";
  if (s >= 40) return "mid";
  return "low";
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add("visible");
}

function hideError() {
  errorMsg.classList.remove("visible");
}

function setLoading(on) {
  loading.classList.toggle("visible", on);
  btn.disabled = on;
  btn.textContent = on ? "Analyse en cours..." : "Analyser ma marque";
}

/* ─── Ring animation ───────────────────────────────── */
function animateRing(score) {
  const circumference = 251.2;
  const offset = circumference - (score / 100) * circumference;
  const fill = document.querySelector(".score-ring .fill");

  fill.classList.remove("good", "mid", "low");
  fill.classList.add(scoreClass(score));
  fill.style.strokeDashoffset = circumference; // start hidden

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = offset;
    });
  });
}

/* ─── Render functions ─────────────────────────────── */
function renderScore(data) {
  document.getElementById("scoreBrand").textContent  = data.brand_name;
  document.getElementById("scoreSector").textContent = data.sector;
  document.getElementById("scoreNumber").textContent = data.brand_score;
  document.getElementById("scoreInsight").textContent= data.analysis.audience;
  animateRing(data.brand_score);
}

function renderSocial(metrics) {
  const ig = metrics.instagram;
  const tk = metrics.tiktok;
  const fb = metrics.facebook;

  // Instagram
  document.getElementById("igStat").textContent      = formatNumber(ig.followers);
  document.getElementById("igStatLabel").textContent = "abonnes";
  document.getElementById("igBar").style.width       = ig.score + "%";

  // TikTok
  document.getElementById("tkStat").textContent      = formatNumber(tk.avg_views);
  document.getElementById("tkStatLabel").textContent = "vues moy.";
  document.getElementById("tkBar").style.width       = tk.score + "%";

  // Facebook
  document.getElementById("fbStat").textContent      = formatNumber(fb.reach_weekly);
  document.getElementById("fbStatLabel").textContent = "portee/sem.";
  document.getElementById("fbBar").style.width       = fb.score + "%";
}

function renderList(containerId, items, cls = "") {
  const el = document.getElementById(containerId);
  el.innerHTML = items.map(i => `<li>${i}</li>`).join("");
  if (cls) el.className = `item-list ${cls}`;
}

function renderChips(containerId, items, accent = false) {
  const el = document.getElementById(containerId);
  el.innerHTML = items.map(i =>
    `<span class="chip${accent ? " accent" : ""}">${i}</span>`
  ).join("");
}

function renderResults(data) {
  // Score hero
  renderScore(data);

  // Social metrics
  renderSocial(data.social_metrics);

  // Analysis
  renderList("strengthsList", data.analysis.strengths, "good");
  renderList("weaknessList",  data.analysis.weaknesses, "bad");

  // Communication strategy
  renderChips("platformChips", data.communication_strategy.priority_platforms, true);
  document.getElementById("frequencyText").textContent = data.communication_strategy.frequency;
  renderChips("contentPillars", data.communication_strategy.content_pillars);

  // Content ideas
  renderList("contentList", data.content_ideas);

  // Marketing strategy
  document.getElementById("acquisitionText").textContent = data.marketing_strategy.acquisition;
  document.getElementById("retentionText").textContent   = data.marketing_strategy.retention;
  document.getElementById("upsellText").textContent      = data.marketing_strategy.upsell;

  // Campaign
  document.getElementById("campaignTitle").textContent  = data.campaign.title;
  document.getElementById("campaignDesc").textContent   = data.campaign.description;
  renderKpis(data.campaign.kpi);

  // Personalized insight
  document.getElementById("requestInsight").textContent = data.user_request_response;
}

function renderKpis(kpis) {
  const grid = document.getElementById("kpiGrid");
  grid.innerHTML = kpis.map(k =>
    `<div class="kpi-item"><div class="kpi-label">${k}</div></div>`
  ).join("");
}

/* ─── Submit ───────────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  hideError();

  const brandName   = brandInput.value.trim();
  const userRequest = requestInput.value.trim();

  if (!brandName) {
    showError("Veuillez saisir le nom de votre marque.");
    brandInput.focus();
    return;
  }

  results.classList.remove("visible");
  results.style.display = "none";
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand_name: brandName, user_request: userRequest }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erreur serveur.");
    }

    const data = await res.json();

    setLoading(false);
    renderResults(data);

    // Reveal results with animation
    results.style.display = "block";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        results.classList.add("visible");
        results.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

  } catch (err) {
    setLoading(false);
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      showError("Impossible de contacter le serveur. Assurez-vous que le backend Python est en cours d'execution sur le port 5000.");
    } else {
      showError(err.message);
    }
  }
}

/* ─── Init ─────────────────────────────────────────── */
form.addEventListener("submit", handleSubmit);
