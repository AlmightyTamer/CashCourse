// ================================================================
//  EDIT YOUR CONTENT HERE
//  videoUrl: YouTube embed URL e.g. "https://www.youtube.com/embed/XXXXX"
//  article: plain text, use \n\n between paragraphs
// ================================================================

var CHAPTERS = [
  {
    id: "ch1",
    emoji: "💵",
    title: "Chapter Name Here",
    tag: "Beginner",
    description: "Chapter description goes here. Tell learners what they will get out of this module.",
    lessons: [
      { id: "ch1-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch1-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" }
    ]
  },
  {
    id: "ch2",
    emoji: "📊",
    title: "Chapter Name Here",
    tag: "Beginner",
    description: "Chapter description goes here. Tell learners what they will get out of this module.",
    lessons: [
      { id: "ch2-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch2-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" }
    ]
  },
  {
    id: "ch3",
    emoji: "💳",
    title: "Chapter Name Here",
    tag: "Intermediate",
    description: "Chapter description goes here. Tell learners what they will get out of this module.",
    lessons: [
      { id: "ch3-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch3-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" }
    ]
  },
  {
    id: "ch4",
    emoji: "📈",
    title: "Chapter Name Here",
    tag: "Intermediate",
    description: "Chapter description goes here. Tell learners what they will get out of this module.",
    lessons: [
      { id: "ch4-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch4-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" }
    ]
  },
  {
    id: "ch5",
    emoji: "🏠",
    title: "Chapter Name Here",
    tag: "Advanced",
    description: "Chapter description goes here. Tell learners what they will get out of this module.",
    lessons: [
      { id: "ch5-l1", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l2", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l3", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l4", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" },
      { id: "ch5-l5", title: "Lesson Title Here", duration: "0:00", videoUrl: "", article: "" }
    ]
  }
];

var CONFIG = {
  heroStat1: { num: "50+",  label: "Free Lessons" },
  heroStat2: { num: "5",    label: "Core Modules" },
  heroStat3: { num: "100%", label: "Free Forever" }
};

// ================================================================
//  STATE
// ================================================================
var currentUser   = null;
var currentLesson = null;
var lessonTab     = "video";

// ── Storage ──────────────────────────────────────────────────────
function storageKey(email) { return "cc_progress_" + email; }

function loadProgress(email) {
  try { return JSON.parse(localStorage.getItem(storageKey(email))) || {}; }
  catch(e) { return {}; }
}
function saveProgress(data) {
  if (!currentUser) return;
  localStorage.setItem(storageKey(currentUser.email), JSON.stringify(data));
}
function getProgress() {
  if (!currentUser) return {};
  return loadProgress(currentUser.email);
}
function isLessonDone(id) { return !!getProgress()[id]; }
function markLessonDone(id) {
  var p = getProgress();
  if (!p[id]) { p[id] = { completedAt: Date.now() }; saveProgress(p); updateStreak(); }
}
function getStreak() {
  if (!currentUser) return 0;
  var p = getProgress();
  var days = {};
  var keys = Object.keys(p);
  for (var i = 0; i < keys.length; i++) {
    var v = p[keys[i]];
    if (v.completedAt) days[new Date(v.completedAt).toDateString()] = true;
  }
  var streak = 0;
  var today = new Date();
  for (var j = 0; j < 365; j++) {
    var d = new Date(today);
    d.setDate(d.getDate() - j);
    if (days[d.toDateString()]) { streak++; }
    else if (j > 0) { break; }
  }
  return streak;
}
function getChapterProgress(ch) {
  var done = 0;
  for (var i = 0; i < ch.lessons.length; i++) {
    if (isLessonDone(ch.lessons[i].id)) done++;
  }
  return { done: done, total: ch.lessons.length, pct: Math.round(done / ch.lessons.length * 100) };
}

// ── Auth storage ─────────────────────────────────────────────────
function saveUser(u) { localStorage.setItem("cc_user", JSON.stringify(u)); }
function loadUser() {
  try { return JSON.parse(localStorage.getItem("cc_user")); }
  catch(e) { return null; }
}
function getAllUsers() {
  try { return JSON.parse(localStorage.getItem("cc_users")) || {}; }
  catch(e) { return {}; }
}
function registerUser(name, email, password) {
  var users = getAllUsers();
  if (users[email]) return false;
  users[email] = { name: name, email: email, password: password };
  localStorage.setItem("cc_users", JSON.stringify(users));
  return true;
}
function validateLogin(email, password) {
  var users = getAllUsers();
  var u = users[email];
  return (u && u.password === password) ? u : null;
}

// ================================================================
//  BOOT
// ================================================================
document.addEventListener("DOMContentLoaded", function() {
  var saved = loadUser();
  if (saved) currentUser = saved;
  buildHeroStats();
  buildTopicsPreview();
  buildCurriculum();
  updateAuthUI();
  initReveal();
  window.addEventListener("scroll", function() {
    var nav = document.getElementById("mainNav");
    if (window.scrollY > 10) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
  setTimeout(animateProgressBars, 600);
  document.getElementById("authModal").addEventListener("click", function(e) {
    if (e.target === document.getElementById("authModal")) closeAuthModal();
  });
});

// ================================================================
//  PAGE ROUTING
// ================================================================
function showPage(name) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove("active");
  var target = document.getElementById("page-" + name);
  if (target) target.classList.add("active");
  var links = document.querySelectorAll(".nav-links a");
  for (var j = 0; j < links.length; j++) links[j].classList.remove("active");
  var navEl = document.getElementById("nav-" + name);
  if (navEl) navEl.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(function() { initReveal(); animateProgressBars(); }, 100);
}

function goToHome()      { showPage("home"); }
function goToCurriculum(){ showPage("curriculum"); }
function goToResources() { showPage("resources"); }
function goToAbout()     { showPage("about"); }

function toggleMobileMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

function updateAuthUI() {
  var loggedIn = !!currentUser;
  document.getElementById("navLoginBtn").style.display  = loggedIn ? "none" : "";
  document.getElementById("navSignupBtn").style.display = loggedIn ? "none" : "";
  document.getElementById("navUserArea").style.display  = loggedIn ? "flex" : "none";
  if (loggedIn) {
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
  var grid = document.getElementById("topicsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  var colors = ["#e6f7f1","#fdf5e6","#fdf0f3","#eef5ff","#f0f4ff","#fdf6ff"];
  for (var i = 0; i < CHAPTERS.length; i++) {
    var ch = CHAPTERS[i];
    var card = document.createElement("div");
    card.className = "topic-card";
    card.setAttribute("onclick", "showPage('curriculum')");
    card.innerHTML =
      '<div class="topic-icon-wrap" style="background:' + colors[i % colors.length] + '">' + ch.emoji + '</div>' +
      '<div class="topic-title">' + ch.title + '</div>' +
      '<div class="topic-desc">' + ch.description + '</div>' +
      '<div class="topic-lessons">' + ch.lessons.length + ' Lessons &rarr;</div>';
    grid.appendChild(card);
  }
}

// ================================================================
//  CURRICULUM
// ================================================================
function buildCurriculum() {
  var list = document.getElementById("modulesList");
  if (!list) return;
  list.innerHTML = "";
  for (var i = 0; i < CHAPTERS.length; i++) {
    var ch = CHAPTERS[i];
    var prog = getChapterProgress(ch);
    var numStyle = prog.done > 0
      ? "background:var(--green);color:white"
      : "background:var(--green-light);color:var(--green)";
    var card = document.createElement("div");
    card.className = "module-card" + (i === 0 ? " open" : "");
    card.id = "mod-" + ch.id;
    var lessonsHTML = "";
    for (var j = 0; j < ch.lessons.length; j++) {
      lessonsHTML += buildLessonRow(ch.lessons[j], i, j);
    }
    card.innerHTML =
      '<div class="module-header" onclick="toggleModule(\'mod-' + ch.id + '\')">' +
        '<div class="module-num" style="' + numStyle + '">' + String(i + 1).padStart(2, "0") + '</div>' +
        '<div class="module-info">' +
          '<div class="module-title">' + ch.emoji + ' ' + ch.title + '</div>' +
          '<div class="module-meta">' + ch.lessons.length + ' lessons &middot; ' + ch.tag + '</div>' +
        '</div>' +
        '<div class="module-chevron">&#9662;</div>' +
      '</div>' +
      '<div class="module-lessons" id="lessons-' + ch.id + '">' +
        lessonsHTML +
        '<div class="progress-module">' +
          '<div class="pm-label"><span>Module Progress</span><span>' + prog.done + ' / ' + prog.total + ' complete</span></div>' +
          '<div class="pm-bar"><div class="pm-fill" style="width:' + prog.pct + '%"></div></div>' +
        '</div>' +
      '</div>';
    list.appendChild(card);
  }
}

function buildLessonRow(lesson, ci, li) {
  var done = isLessonDone(lesson.id);
  var playStyle  = done ? "background:var(--green);color:white" : "";
  var checkStyle = done ? "display:flex" : "display:none";
  return '<div class="lesson-row" onclick="openLesson(' + ci + ',' + li + ')">' +
    '<div class="lesson-play" style="' + playStyle + '">&#9654;</div>' +
    '<div class="lesson-name">' + lesson.title + '</div>' +
    '<div class="lesson-dur">' + (lesson.duration || "—") + '</div>' +
    '<div class="lesson-done" style="' + checkStyle + '"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>' +
  '</div>';
}

function toggleModule(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle("open");
}

function refreshCurriculum() {
  buildCurriculum();
  buildTopicsPreview();
}

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
  if (!currentLesson) return;
  var ci = currentLesson.chapterIndex;
  var li = currentLesson.lessonIndex;
  var ch = CHAPTERS[ci];
  var l  = ch.lessons[li];
  var prog = getChapterProgress(ch);

  document.getElementById("lessonBreadcrumbChapter").textContent = ch.title;
  document.getElementById("lessonBreadcrumbLesson").textContent  = l.title;
  document.getElementById("lessonTitle").textContent       = l.title;
  document.getElementById("lessonChapterName").textContent = ch.title;
  document.getElementById("lessonDuration").textContent    = l.duration || "—";
  document.getElementById("lessonNum").textContent         = "Lesson " + (li + 1) + " of " + ch.lessons.length;
  document.getElementById("lessonTag").textContent         = ch.tag;

  var iframe      = document.getElementById("lessonIframe");
  var placeholder = document.getElementById("videoPlaceholder");
  if (l.videoUrl) {
    iframe.src = l.videoUrl;
    placeholder.style.display = "none";
  } else {
    iframe.src = "";
    placeholder.style.display = "flex";
  }

  var artBody = document.getElementById("lessonArticleBody");
  if (l.article) {
    var parts = l.article.split("\n\n");
    var html = "";
    for (var i = 0; i < parts.length; i++) html += "<p>" + parts[i] + "</p>";
    artBody.innerHTML = html;
  } else {
    artBody.innerHTML = '<div class="placeholder-text">&#128221; Article content coming soon!</div>';
  }

  switchLessonTab("video");

  var btn = document.getElementById("markDoneBtn");
  if (isLessonDone(l.id)) {
    btn.textContent = "&#10003; Completed";
    btn.disabled    = true;
    btn.style.opacity = "0.6";
  } else {
    btn.textContent   = "Mark as Complete &#10003;";
    btn.disabled      = false;
    btn.style.opacity = "1";
  }

  buildLessonSidebar(ci, li);

  var prevBtn = document.getElementById("prevLessonBtn");
  var nextBtn = document.getElementById("nextLessonBtn");
  prevBtn.style.visibility = (li === 0) ? "hidden" : "visible";
  nextBtn.textContent = (li === ch.lessons.length - 1) ? "Back to Module" : "Next Lesson \u2192";
}

function switchLessonTab(tab) {
  lessonTab = tab;
  document.getElementById("lessonVideoPanel").style.display   = (tab === "video")   ? "block" : "none";
  document.getElementById("lessonArticlePanel").style.display = (tab === "article") ? "block" : "none";
  document.getElementById("tabVideoBtn").classList.toggle("active",   tab === "video");
  document.getElementById("tabArticleBtn").classList.toggle("active", tab === "article");
}

function markCurrentDone() {
  if (!currentLesson) return;
  var l = CHAPTERS[currentLesson.chapterIndex].lessons[currentLesson.lessonIndex];
  markLessonDone(l.id);
  renderLesson();
  refreshCurriculum();
  showToast("Lesson complete! Keep it up.");
}

function prevLesson() {
  if (!currentLesson) return;
  if (currentLesson.lessonIndex > 0) {
    currentLesson.lessonIndex--;
    renderLesson();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function nextLesson() {
  if (!currentLesson) return;
  var ci = currentLesson.chapterIndex;
  var li = currentLesson.lessonIndex;
  if (li < CHAPTERS[ci].lessons.length - 1) {
    currentLesson.lessonIndex++;
    renderLesson();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showPage("curriculum");
  }
}

function buildLessonSidebar(ci, li) {
  var ch   = CHAPTERS[ci];
  var prog = getChapterProgress(ch);
  document.getElementById("sidebarModuleTitle").textContent = ch.title;
  document.getElementById("sidebarProgLabel").textContent   = prog.done + " of " + prog.total;
  document.getElementById("sidebarProgFill").style.width    = prog.pct + "%";
  var ul = document.getElementById("sidebarLessonList");
  ul.innerHTML = "";
  for (var i = 0; i < ch.lessons.length; i++) {
    var l  = ch.lessons[i];
    var el = document.createElement("li");
    el.className = "sc-lesson" + (i === li ? " current" : "") + (isLessonDone(l.id) ? " done" : "");
    el.innerHTML = '<div class="sc-dot"></div>' + l.title;
    (function(idx) {
      el.addEventListener("click", function() {
        currentLesson.lessonIndex = idx;
        renderLesson();
        window.scrollTo({ top: 0 });
      });
    })(i);
    ul.appendChild(el);
  }
  document.getElementById("sidebarStreakNum").textContent = getStreak();
  buildStreakDots();
}

function buildStreakDots() {
  var p    = getProgress();
  var days = {};
  var keys = Object.keys(p);
  for (var i = 0; i < keys.length; i++) {
    var v = p[keys[i]];
    if (v.completedAt) days[new Date(v.completedAt).toDateString()] = true;
  }
  var labels = ["M","T","W","T","F","S","S"];
  var today  = new Date();
  var dow    = (today.getDay() + 6) % 7;
  var c = document.getElementById("streakDots");
  c.innerHTML = "";
  for (var j = 0; j < 7; j++) {
    var d = new Date(today);
    d.setDate(d.getDate() - (dow - j));
    var dot = document.createElement("div");
    dot.className = "streak-dot" + (days[d.toDateString()] ? " active" : "");
    dot.textContent = labels[j];
    c.appendChild(dot);
  }
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
  var isLogin = (mode === "login");
  document.getElementById("authModalTitle").textContent = isLogin ? "Welcome back" : "Create your account";
  document.getElementById("authSubmitBtn").textContent  = isLogin ? "Log In" : "Sign Up Free";
  document.getElementById("authNameGroup").style.display = isLogin ? "none" : "";
  document.getElementById("authModal").dataset.mode = mode;
  if (isLogin) {
    document.getElementById("authToggleMsg").innerHTML = 'Don\'t have an account? <a href="#" onclick="switchAuthMode(\'signup\');return false;">Sign up free &rarr;</a>';
  } else {
    document.getElementById("authToggleMsg").innerHTML = 'Already have an account? <a href="#" onclick="switchAuthMode(\'login\');return false;">Log in &rarr;</a>';
  }
  clearAuthErrors();
}

function handleAuthSubmit() {
  var mode     = document.getElementById("authModal").dataset.mode;
  var email    = document.getElementById("authEmail").value.trim();
  var password = document.getElementById("authPassword").value;
  var name     = document.getElementById("authName").value.trim();
  clearAuthErrors();

  if (!email || email.indexOf("@") === -1) { showAuthError("Please enter a valid email."); return; }
  if (password.length < 6) { showAuthError("Password must be at least 6 characters."); return; }

  if (mode === "signup") {
    if (!name) { showAuthError("Please enter your name."); return; }
    if (!registerUser(name, email, password)) { showAuthError("An account with that email already exists."); return; }
    currentUser = { name: name, email: email };
  } else {
    var u = validateLogin(email, password);
    if (!u) { showAuthError("Incorrect email or password."); return; }
    currentUser = { name: u.name, email: email };
  }

  saveUser(currentUser);
  closeAuthModal();
  updateAuthUI();
  refreshCurriculum();
  showToast("Welcome, " + currentUser.name + "!");
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("cc_user");
  updateAuthUI();
  refreshCurriculum();
  showPage("home");
  showToast("You have been logged out.");
}

function showAuthError(msg) {
  var e = document.getElementById("authError");
  e.textContent = msg;
  e.style.display = "block";
}

function clearAuthErrors() {
  document.getElementById("authError").style.display = "none";
  document.getElementById("authError").textContent   = "";
  var fields = ["authName", "authEmail", "authPassword"];
  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById(fields[i]);
    if (el) el.value = "";
  }
}

// ================================================================
//  BUDGET CALCULATOR
// ================================================================
function calcBudget() {
  var income   = parseFloat(document.getElementById("income").value)   || 0;
  var fixed    = parseFloat(document.getElementById("fixed").value)    || 0;
  var variable = parseFloat(document.getElementById("variable").value) || 0;
  var debt     = parseFloat(document.getElementById("debt").value)     || 0;
  var result   = document.getElementById("budgetResult");
  if (!income) { result.style.display = "none"; return; }
  var leftover = income - fixed - variable - debt;
  function fmt(n) { return "$" + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 }); }
  document.getElementById("resNeeds").textContent   = fmt(income * 0.50);
  document.getElementById("resWants").textContent   = fmt(income * 0.30);
  document.getElementById("resSavings").textContent = fmt(income * 0.20);
  var leftEl = document.getElementById("resLeft");
  leftEl.textContent = (leftover < 0 ? "-" : "+") + fmt(leftover);
  leftEl.className   = "bcr-val" + (leftover < 0 ? " warn" : "");
  result.style.display = "flex";
}

// ================================================================
//  ANIMATIONS & TOAST
// ================================================================
function initReveal() {
  var els = document.querySelectorAll(".reveal");
  var obs = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("visible");
        obs.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.08 });
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove("visible");
    obs.observe(els[i]);
  }
}

function animateProgressBars() {
  var bars = document.querySelectorAll(".progress-fill, .pm-fill, .sc-prog-fill");
  for (var i = 0; i < bars.length; i++) {
    (function(el) {
      var w = el.style.width;
      el.style.transition = "none";
      el.style.width = "0";
      setTimeout(function() {
        el.style.transition = "width 1.2s ease";
        el.style.width = w;
      }, 80);
    })(bars[i]);
  }
}

function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 3000);
}

function updateStreak() {
  var s = getStreak();
  if (s > 0 && s % 5 === 0) showToast(s + "-day streak!");
  updateAuthUI();
}
