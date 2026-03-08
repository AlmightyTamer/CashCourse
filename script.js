// ================================================================
//  ✏️  EDIT YOUR CONTENT HERE — top of this file
//
//  To add a chapter: copy one block, paste inside CHAPTERS, fill in.
//  To add a lesson:  add an object to the chapter's `lessons` array.
//  videoUrl: YouTube embed URL e.g. "https://www.youtube.com/embed/XXXXX"
//  article:  plain text, use \n\n for new paragraphs
// ================================================================

const CHAPTERS = [
  {
    id: "ch1",
    emoji: "💵",
    title: "Chapter Name Here",
    tag: "Beginner",
    description: "Chapter description goes here. Tell learners what they'll get out of this module.",
    lessons: [
      { id: "ch1-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
    ]
  },
  {
    id: "ch2",
    emoji: "📊",
    title: "Chapter Name Here",
    tag: "Beginner",
    description: "Chapter description goes here. Tell learners what they'll get out of this module.",
    lessons: [
      { id: "ch2-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
    ]
  },
  {
    id: "ch3",
    emoji: "💳",
    title: "Chapter Name Here",
    tag: "Intermediate",
    description: "Chapter description goes here. Tell learners what they'll get out of this module.",
    lessons: [
      { id: "ch3-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
    ]
  },
  {
    id: "ch4",
    emoji: "📈",
    title: "Chapter Name Here",
    tag: "Intermediate",
    description: "Chapter description goes here. Tell learners what they'll get out of this module.",
    lessons: [
      { id: "ch4-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
    ]
  },
  {
    id: "ch5",
    emoji: "🏠",
    title: "Chapter Name Here",
    tag: "Advanced",
    description: "Chapter description goes here. Tell learners what they'll get out of this module.",
    lessons: [
      { id: "ch5-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
    ]
  },
];

const CONFIG = {
  heroStat1: { num: "50+",  label: "Free Lessons" },
  heroStat2: { num: "5",    label: "Core Modules" },
  heroStat3: { num: "100%", label: "Free Forever" },
};

// ================================================================
//  APP STATE
// ================================================================
let currentUser   = null;
let currentLesson = null;
let lessonTab     = "video";

function storageKey(email) { return "cc_progress_" + email; }
function loadProgress(email) { try { return JSON.parse(localStorage.getItem(storageKey(email))) || {}; } catch { return {}; } }
function saveProgress(data) { if (!currentUser) return; localStorage.setItem(storageKey(currentUser.email), JSON.stringify(data)); }
function getProgress() { if (!currentUser) return {}; return loadProgress(currentUser.email); }
function isLessonDone(id) { return !!getProgress()[id]; }
function markLessonDone(id) {
  const p = getProgress();
  if (!p[id]) { p[id] = { completedAt: Date.now() }; saveProgress(p); updateStreak(); }
}
function getStreak() {
  if (!currentUser) return 0;
  const days = new Set(Object.values(getProgress()).map(v => v.completedAt ? new Date(v.completedAt).toDateString() : null).filter(Boolean));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) streak++; else if (i > 0) break;
  }
  return streak;
}
function getChapterProgress(ch) {
  const done = ch.lessons.filter(l => isLessonDone(l.id)).length;
  return { done, total: ch.lessons.length, pct: Math.round(done / ch.lessons.length * 100) };
}
function saveUser(u) { localStorage.setItem("cc_user", JSON.stringify(u)); }
function loadUser() { try { return JSON.parse(localStorage.getItem("cc_user")); } catch { return null; } }
function getAllUsers() { try { return JSON.parse(localStorage.getItem("cc_users")) || {}; } catch { return {}; } }
function registerUser(name, email, password) {
  const users = getAllUsers();
  if (users[email]) return false;
  users[email] = { name, email, password };
  localStorage.setItem("cc_users", JSON.stringify(users));
  return true;
}
function validateLogin(email, password) {
  const u = getAllUsers()[email];
  return u && u.password === password ? u : null;
}

// ================================================================
//  BOOT
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
  const saved = loadUser();
  if (saved) currentUser = saved;
  buildHeroStats();
  buildTopicsPreview();
  buildCurriculum();
  updateAuthUI();
  initReveal();
  window.addEventListener("scroll", () => {
    document.getElementById("mainNav").classList.toggle("scrolled", window.scrollY > 10);
  });
  setTimeout(animateProgressBars, 600);
});

// ================================================================
//  NAV / ROUTING
// ================================================================
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  const el = document.getElementById("nav-" + name);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => { initReveal(); animateProgressBars(); }, 100);
}
function goToHome()      { showPage("home"); }
function goToCurriculum(){ showPage("curriculum"); }
function goToResources() { showPage("resources"); }
function goToAbout()     { showPage("about"); }
function toggleMobileMenu() { document.getElementById("mobileMenu").classList.toggle("open"); }

function updateAuthUI() {
  const in_ = !!currentUser;
  document.getElementById("navLoginBtn").style.display  = in_ ? "none" : "";
  document.getElementById("navSignupBtn").style.display = in_ ? "none" : "";
  document.getElementById("navUserArea").style.display  = in_ ? "flex" : "none";
  if (in_) {
    document.getElementById("navUserName").textContent    = currentUser.name;
    document.getElementById("navStreakBadge").textContent = "🔥 " + getStreak();
  }
}

// ================================================================
//  HOME
// ================================================================
function buildHeroStats() {
  document.getElementById("heroStat1Num").textContent   = CONFIG.heroStat1.num;
  document.getElementById("heroStat1Label").textContent = CONFIG.heroStat1.label;
  document.getElementById("heroStat2Num").textContent   = CONFIG.heroStat2.num;
  document.getElementById("heroStat2Label").textContent = CONFIG.heroStat2.label;
  document.getElementById("heroStat3Num").textContent   = CONFIG.heroStat3.num;
  document.getElementById("heroStat3Label").textContent = CONFIG.heroStat3.label;
}
function buildTopicsPreview() {
  const grid = document.getElementById("topicsGrid");
  grid.innerHTML = "";
  const colors = ["#e6f7f1","#fdf5e6","#fdf0f3","#eef5ff","#f0f4ff","#fdf6ff"];
  CHAPTERS.forEach((ch, i) => {
    const card = document.createElement("div");
    card.className = "topic-card";
    card.onclick = () => showPage("curriculum");
    card.innerHTML = `<div class="topic-icon-wrap" style="background:${colors[i%colors.length]}">${ch.emoji}</div><div class="topic-title">${ch.title}</div><div class="topic-desc">${ch.description}</div><div class="topic-lessons">${ch.lessons.length} Lessons →</div>`;
    grid.appendChild(card);
  });
}

// ================================================================
//  CURRICULUM
// ================================================================
function buildCurriculum() {
  const list = document.getElementById("modulesList");
  list.innerHTML = "";
  CHAPTERS.forEach((ch, ci) => {
    const prog = getChapterProgress(ch);
    const numStyle = prog.done > 0 ? "background:var(--green);color:white" : "background:var(--green-light);color:var(--green)";
    const card = document.createElement("div");
    card.className = "module-card" + (ci === 0 ? " open" : "");
    card.id = "mod-" + ch.id;
    card.innerHTML = `
      <div class="module-header" onclick="toggleModule('mod-${ch.id}')">
        <div class="module-num" style="${numStyle}">${String(ci+1).padStart(2,"0")}</div>
        <div class="module-info">
          <div class="module-title">${ch.emoji} ${ch.title}</div>
          <div class="module-meta">${ch.lessons.length} lessons · ${ch.tag}</div>
        </div>
        <div class="module-chevron">▾</div>
      </div>
      <div class="module-lessons" id="lessons-${ch.id}">
        ${ch.lessons.map((l,li) => buildLessonRow(l,ci,li)).join("")}
        <div class="progress-module">
          <div class="pm-label"><span>Module Progress</span><span>${prog.done} / ${prog.total} complete</span></div>
          <div class="pm-bar"><div class="pm-fill" style="width:${prog.pct}%"></div></div>
        </div>
      </div>`;
    list.appendChild(card);
  });
}
function buildLessonRow(lesson, ci, li) {
  const done = isLessonDone(lesson.id);
  return `<div class="lesson-row" onclick="openLesson(${ci},${li})">
    <div class="lesson-play" style="${done?"background:var(--green);color:white":""}">▶</div>
    <div class="lesson-name">${lesson.title}</div>
    <div class="lesson-dur">${lesson.duration||"—"}</div>
    <div class="lesson-done" style="${done?"display:flex":"display:none"}"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
  </div>`;
}
function toggleModule(id) { document.getElementById(id).classList.toggle("open"); }
function refreshCurriculum() { buildCurriculum(); buildTopicsPreview(); }

// ================================================================
//  LESSON
// ================================================================
function openLesson(ci, li) {
  if (!currentUser) { openAuthModal("login"); return; }
  currentLesson = { chapterIndex: ci, lessonIndex: li };
  renderLesson();
  showPage("lesson");
}
function renderLesson() {
  const { chapterIndex: ci, lessonIndex: li } = currentLesson;
  const ch = CHAPTERS[ci], l = ch.lessons[li];
  const prog = getChapterProgress(ch);
  document.getElementById("lessonBreadcrumbChapter").textContent = ch.title;
  document.getElementById("lessonBreadcrumbLesson").textContent  = l.title;
  document.getElementById("lessonTitle").textContent       = l.title;
  document.getElementById("lessonChapterName").textContent = ch.title;
  document.getElementById("lessonDuration").textContent    = l.duration || "—";
  document.getElementById("lessonNum").textContent         = `Lesson ${li+1} of ${ch.lessons.length}`;
  document.getElementById("lessonTag").textContent         = ch.tag;

  const iframe = document.getElementById("lessonIframe");
  const placeholder = document.getElementById("videoPlaceholder");
  if (l.videoUrl) { iframe.src = l.videoUrl; placeholder.style.display = "none"; }
  else            { iframe.src = ""; placeholder.style.display = "flex"; }

  const artBody = document.getElementById("lessonArticleBody");
  artBody.innerHTML = l.article
    ? `<p>${l.article.replace(/\n\n/g,"</p><p>")}</p>`
    : `<div class="placeholder-text">📝 Article content coming soon!</div>`;

  switchLessonTab("video");

  const btn = document.getElementById("markDoneBtn");
  if (isLessonDone(l.id)) { btn.textContent = "✓ Completed"; btn.disabled = true; btn.style.opacity = ".6"; }
  else                    { btn.textContent = "Mark as Complete ✓"; btn.disabled = false; btn.style.opacity = "1"; }

  buildLessonSidebar(ci, li);
  document.getElementById("prevLessonBtn").style.visibility = li === 0 ? "hidden" : "visible";
  document.getElementById("nextLessonBtn").textContent      = li === ch.lessons.length-1 ? "Back to Module" : "Next Lesson →";
}
function switchLessonTab(tab) {
  lessonTab = tab;
  document.getElementById("lessonVideoPanel").style.display   = tab==="video"   ? "block" : "none";
  document.getElementById("lessonArticlePanel").style.display = tab==="article" ? "block" : "none";
  document.getElementById("tabVideoBtn").classList.toggle("active",   tab==="video");
  document.getElementById("tabArticleBtn").classList.toggle("active", tab==="article");
}
function markCurrentDone() {
  const l = CHAPTERS[currentLesson.chapterIndex].lessons[currentLesson.lessonIndex];
  markLessonDone(l.id);
  renderLesson();
  refreshCurriculum();
  showToast("✅ Lesson complete! Keep it up.");
}
function prevLesson() {
  if (currentLesson.lessonIndex > 0) { currentLesson.lessonIndex--; renderLesson(); window.scrollTo({top:0,behavior:"smooth"}); }
}
function nextLesson() {
  const { chapterIndex: ci, lessonIndex: li } = currentLesson;
  if (li < CHAPTERS[ci].lessons.length-1) { currentLesson.lessonIndex++; renderLesson(); window.scrollTo({top:0,behavior:"smooth"}); }
  else showPage("curriculum");
}
function buildLessonSidebar(ci, li) {
  const ch = CHAPTERS[ci], prog = getChapterProgress(ch);
  document.getElementById("sidebarModuleTitle").textContent = ch.title;
  document.getElementById("sidebarProgLabel").textContent   = `${prog.done} of ${prog.total}`;
  document.getElementById("sidebarProgFill").style.width    = prog.pct + "%";
  const ul = document.getElementById("sidebarLessonList");
  ul.innerHTML = "";
  ch.lessons.forEach((l, idx) => {
    const el = document.createElement("li");
    el.className = "sc-lesson" + (idx===li?" current":"") + (isLessonDone(l.id)?" done":"");
    el.onclick = () => { currentLesson.lessonIndex = idx; renderLesson(); window.scrollTo({top:0}); };
    el.innerHTML = `<div class="sc-dot"></div>${l.title}`;
    ul.appendChild(el);
  });
  document.getElementById("sidebarStreakNum").textContent = getStreak();
  buildStreakDots();
}
function buildStreakDots() {
  const days = new Set(Object.values(getProgress()).map(v => v.completedAt ? new Date(v.completedAt).toDateString() : null).filter(Boolean));
  const labels = ["M","T","W","T","F","S","S"];
  const today = new Date(), dow = (today.getDay()+6)%7;
  const c = document.getElementById("streakDots");
  c.innerHTML = "";
  labels.forEach((lbl, i) => {
    const d = new Date(today); d.setDate(d.getDate()-(dow-i));
    const dot = document.createElement("div");
    dot.className = "streak-dot" + (days.has(d.toDateString()) ? " active" : "");
    dot.textContent = lbl;
    c.appendChild(dot);
  });
}

// ================================================================
//  AUTH
// ================================================================
function openAuthModal(mode) {
  document.getElementById("authModal").style.display = "flex";
  switchAuthMode(mode || "login");
}
function closeAuthModal() {
  document.getElementById("authModal").style.display = "none";
  clearAuthErrors();
}
function switchAuthMode(mode) {
  const isLogin = mode === "login";
  document.getElementById("authModalTitle").textContent = isLogin ? "Welcome back" : "Create your account";
  document.getElementById("authSubmitBtn").textContent  = isLogin ? "Log In" : "Sign Up Free";
  document.getElementById("authToggleMsg").innerHTML    = isLogin
    ? `Don't have an account? <a onclick="switchAuthMode('signup')">Sign up free →</a>`
    : `Already have an account? <a onclick="switchAuthMode('login')">Log in →</a>`;
  document.getElementById("authNameGroup").style.display = isLogin ? "none" : "";
  document.getElementById("authModal").dataset.mode = mode;
  clearAuthErrors();
}
function handleAuthSubmit() {
  const mode = document.getElementById("authModal").dataset.mode;
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const name = document.getElementById("authName").value.trim();
  clearAuthErrors();
  if (!email || !email.includes("@")) return showAuthError("Please enter a valid email.");
  if (password.length < 6)             return showAuthError("Password must be at least 6 characters.");
  if (mode === "signup") {
    if (!name) return showAuthError("Please enter your name.");
    if (!registerUser(name, email, password)) return showAuthError("An account with that email already exists.");
    currentUser = { name, email };
  } else {
    const u = validateLogin(email, password);
    if (!u) return showAuthError("Incorrect email or password.");
    currentUser = { name: u.name, email };
  }
  saveUser(currentUser);
  closeAuthModal();
  updateAuthUI();
  refreshCurriculum();
  showToast(`👋 Welcome, ${currentUser.name}!`);
}
function handleLogout() {
  currentUser = null;
  localStorage.removeItem("cc_user");
  updateAuthUI();
  refreshCurriculum();
  showPage("home");
  showToast("You've been logged out.");
}
function showAuthError(msg) { const e = document.getElementById("authError"); e.textContent = msg; e.style.display = "block"; }
function clearAuthErrors() {
  document.getElementById("authError").style.display = "none";
  ["authName","authEmail","authPassword"].forEach(id => { const el = document.getElementById(id); if(el) el.value = ""; });
}
document.addEventListener("click", e => { if (e.target.id === "authModal") closeAuthModal(); });

// ================================================================
//  BUDGET CALCULATOR
// ================================================================
function calcBudget() {
  const income = parseFloat(document.getElementById("income").value)||0;
  const fixed  = parseFloat(document.getElementById("fixed").value)||0;
  const variable = parseFloat(document.getElementById("variable").value)||0;
  const debt   = parseFloat(document.getElementById("debt").value)||0;
  const result = document.getElementById("budgetResult");
  if (!income) { result.style.display = "none"; return; }
  const leftover = income - fixed - variable - debt;
  const fmt = n => "$" + Math.abs(n).toLocaleString("en-US",{maximumFractionDigits:0});
  document.getElementById("resNeeds").textContent   = fmt(income*.50);
  document.getElementById("resWants").textContent   = fmt(income*.30);
  document.getElementById("resSavings").textContent = fmt(income*.20);
  const leftEl = document.getElementById("resLeft");
  leftEl.textContent = (leftover<0?"-":"+")+fmt(leftover);
  leftEl.className = "bcr-val" + (leftover<0?" warn":"");
  result.style.display = "flex";
}

// ================================================================
//  ANIMATIONS
// ================================================================
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);} });
  }, {threshold:.08});
  document.querySelectorAll(".reveal").forEach(el => { el.classList.remove("visible"); obs.observe(el); });
}
function animateProgressBars() {
  document.querySelectorAll(".progress-fill,.pm-fill,.sc-prog-fill").forEach(el => {
    const w = el.style.width;
    el.style.transition = "none"; el.style.width = "0";
    setTimeout(() => { el.style.transition = "width 1.2s ease"; el.style.width = w; }, 80);
  });
}
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}
function updateStreak() { const s = getStreak(); if (s>0 && s%5===0) showToast(`🔥 ${s}-day streak!`); updateAuthUI(); }
