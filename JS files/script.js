
// Mock signup
document.getElementById("signupBtn").addEventListener("click", function() {
  alert("Account created! Redirecting to course page...");
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("overview").classList.add("hidden");
  document.getElementById("coursePage").classList.remove("hidden");

  loadChapters();
  loadStats();
});

// Example JSON data for courses
const courses = {
  "01_foundations": {
    "title": "Foundations of Money",
    "articles": ["What is Money?", "How Banks Work", "Inflation Basics"],
    "videos": ["intro.mp4", "banks.mp4"]
  },
  "02_budgeting_saving": {
    "title": "Budgeting & Saving",
    "articles": ["Tracking Expenses", "Building an Emergency Fund"],
    "videos": ["budget_intro.mp4", "savings.mp4"]
  }
};

function loadChapters() {
  const container = document.getElementById("chapters");
  container.innerHTML = "";

  for (let key in courses) {
    const chapter = courses[key];
    const div = document.createElement("div");
    div.classList.add("chapter");
    div.innerHTML = `<h3>${chapter.title}</h3>
                     <p>${chapter.articles.length} Articles | ${chapter.videos.length} Videos</p>`;
    container.appendChild(div);
  }
}

function loadStats() {
  const users = 1200;
  const lessons = Object.keys(courses).length * 5; // example
  const videos = Object.keys(courses).reduce((acc, key) => acc + courses[key].videos.length, 0);

  document.getElementById("users").innerText = users;
  document.getElementById("lessons").innerText = lessons;
  document.getElementById("videos").innerText = videos;
}
