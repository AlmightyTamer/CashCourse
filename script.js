/* NAV & PAGE */
function showPage(pageId){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  let navLink = document.getElementById('nav-' + pageId);
  if(navLink) navLink.classList.add('active');
}

function goToHome(){ showPage('home'); }

/* MOBILE MENU */
function toggleMobileMenu(){
  const menu = document.getElementById('mobileMenu');
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

/* AUTH MODAL */
let authMode = 'login';
function openAuthModal(mode){
  authMode = mode;
  const modal = document.getElementById('authModal');
  modal.style.display = 'flex';
  document.getElementById('authModalTitle').innerText = mode==='login' ? 'Welcome back' : 'Create your account';
  document.getElementById('authSubmitBtn').innerText = mode==='login' ? 'Log In' : 'Sign Up';
  document.getElementById('authNameGroup').style.display = mode==='login' ? 'none' : 'block';
}
function closeAuthModal(){ document.getElementById('authModal').style.display='none'; }
function switchAuthMode(mode){ openAuthModal(mode); }
function handleAuthSubmit(){ showToast(authMode==='login' ? 'Logged in!' : 'Account created!'); closeAuthModal(); }

/* TOAST */
function showToast(msg){
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.style.display='block';
  setTimeout(()=>{ t.style.display='none'; }, 2500);
}

/* LESSON NAVIGATION (basic placeholders) */
function prevLesson(){ showToast('Previous Lesson'); }
function nextLesson(){ showToast('Next Lesson'); }
function markCurrentDone(){ showToast('Lesson marked complete'); }

/* BUDGET CALCULATOR */
function calcBudget(){
  let income=parseFloat(document.getElementById('income').value)||0;
  let fixed=parseFloat(document.getElementById('fixed').value)||0;
  let variable=parseFloat(document.getElementById('variable').value)||0;
  let debt=parseFloat(document.getElementById('debt').value)||0;
  if(income>0){
    let needs=(income*0.5 - fixed).toFixed(2);
    let wants=(income*0.3 - variable).toFixed(2);
    let savings=(income*0.2 - debt).toFixed(2);
    let left=(income - fixed - variable - debt).toFixed(2);
    document.getElementById('resNeeds').innerText='$'+needs;
    document.getElementById('resWants').innerText='$'+wants;
    document.getElementById('resSavings').innerText='$'+savings;
    document.getElementById('resLeft').innerText='$'+left;
    document.getElementById('budgetResult').style.display='block';
  } else { document.getElementById('budgetResult').style.display='none'; }
}

/* SIDEBAR / STREAK placeholders */
function handleLogout(){ showToast('Logged out'); document.getElementById('navUserArea').style.display='none'; }

/* Ready for future expansions: lessons, modules, streaks, etc. */
