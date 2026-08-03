/* ==========================================================================
   FOREIGNCODER — TEAM MEMBER VIEW INTERACTIVE SCRIPT (AMBER AVIATION THEME)
   ========================================================================== */

// Complete real project data for all 6 squad members
const TEAM_MEMBERS = [
  {
    name: "Shuvo Das",
    role: "Team Leader",
    enroll: "2403051051377 • Div 5A15",
    location: "Bangladesh",
    email: "engrshuvoda@gmail.com",
    github: "https://github.com/engrshuvodas",
    photo: "../img/team/Shuvo Das.png",
    bio: "Leading the ForeignCoder squad with a vision for international collaboration and high-impact software delivery."
  },
  {
    name: "Vitumbiko Ziba",
    role: "Communications & Presentation",
    enroll: "2403051051378 • Div 5A15",
    location: "Africa",
    email: "vituglory@gmail.com",
    github: "https://github.com/vituzi",
    photo: "../img/team/Vitumbiko Ziba.jpeg",
    bio: "Crafting compelling narratives and presentations that bridge technical complexity with clear, impactful communication."
  },
  {
    name: "Bipu Roy",
    role: "Strategy & Ideation",
    enroll: "2403051051363 • Div 5A13",
    location: "Bangladesh",
    email: "bipur8910@gmail.com",
    github: "https://github.com/BipuRoy",
    photo: "../img/team/bipu.jpeg",
    bio: "Driving the product vision with creative problem-solving, competitive analysis, and out-of-the-box strategic thinking."
  },
  {
    name: "Setu Mondal",
    role: "Quality Assurance Tester",
    enroll: "2403051051376 • Div 5A15",
    location: "Bangladesh",
    email: "setumondal32@gmail.com",
    github: "https://github.com/setucloud",
    photo: "../img/team/Setu Mondol.jpeg",
    bio: "Ensuring every feature ships with confidence through rigorous testing strategies and a zero-defect mindset."
  },
  {
    name: "Sajib Biswas",
    role: "UI/UX Designer",
    enroll: "2403051240220 • Div 5B3",
    location: "Bangladesh",
    email: "bsajib116@gmail.com",
    github: "https://github.com/mrsajib07",
    photo: "../img/team/Sajib biswas.png",
    bio: "Translating complex requirements into intuitive, pixel-perfect interfaces that delight users and drive engagement."
  },
  {
    name: "Monami Sadhu",
    role: "Documentation & Presentation",
    enroll: "2403051051375 • Div 5A15",
    location: "Bangladesh",
    email: "monamisadhu67@gmail.com",
    github: "https://github.com/monami2005",
    photo: "../img/team/Monami .png",
    bio: "Producing crystal-clear documentation and polished presentations that bring the team's technical work to life.",
    photoScale: 1.25
  }
];

// State variables
let currentIndex = 0;
let autoSlideInterval = null;
let isPlaying = true;
const SLIDE_INTERVAL_MS = 3000; // 3 seconds interval

// DOM elements
const slideContent   = document.querySelector(".slide-content");
const memberName     = document.getElementById("member-name");
const memberRole     = document.getElementById("member-role");
const memberBio      = document.getElementById("member-bio");
const memberEnroll   = document.getElementById("member-enroll");
const memberLocation = document.getElementById("member-location");
const memberEmail    = document.getElementById("member-email");
const memberGithub   = document.getElementById("member-github");
const memberPhoto    = document.getElementById("member-photo");
const thumbnailList  = document.getElementById("thumbnail-list");

const btnPrev        = document.getElementById("btn-prev");
const btnNext        = document.getElementById("btn-next");
const btnTogglePlay  = document.getElementById("toggle-play");
const playIcon       = document.getElementById("play-icon");

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderThumbnails();
  updateSlide(currentIndex, false);
  startAutoSlide();
  setupEventListeners();
});

/* ==========================================================================
   RENDER BOTTOM THUMBNAILS
   ========================================================================== */
function renderThumbnails() {
  thumbnailList.innerHTML = "";

  TEAM_MEMBERS.forEach((member, index) => {
    const thumbItem = document.createElement("div");
    thumbItem.className = `thumb-item ${index === 0 ? "active" : ""}`;
    thumbItem.setAttribute("role", "button");
    thumbItem.setAttribute("tabindex", "0");
    thumbItem.setAttribute("aria-label", `Show ${member.name}`);

    // Fallback UI Avatar URL
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=150&background=081C3A&color=10CFC9&bold=true`;

    thumbItem.innerHTML = `
      <div class="thumb-avatar-wrap">
        <img 
          src="${member.photo}" 
          alt="${member.name}" 
          class="thumb-avatar"
          onerror="this.src='${fallbackUrl}'"
        />
      </div>
      <span class="thumb-name">${member.name}</span>
      <span class="thumb-role">${member.role}</span>
    `;

    thumbItem.addEventListener("click", () => {
      goToSlide(index);
      resetAutoSlide();
    });

    thumbItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToSlide(index);
        resetAutoSlide();
      }
    });

    thumbnailList.appendChild(thumbItem);
  });
}

/* ==========================================================================
   SLIDE TRANSITION & UPDATE LOGIC
   ========================================================================== */
function updateSlide(index, animate = true) {
  const member = TEAM_MEMBERS[index];
  if (!member) return;

  const performDOMUpdate = () => {
    // Update Text Content
    memberName.textContent     = member.name;
    memberRole.textContent     = member.role;
    memberBio.textContent      = member.bio;
    memberEnroll.textContent   = member.enroll;
    memberLocation.textContent = member.location;
    memberEmail.textContent    = member.email;
    memberEmail.href           = `mailto:${member.email}`;
    memberGithub.href          = member.github;

    // Set Photo, Custom Scale, & Error Fallback
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=600&background=081C3A&color=10CFC9&bold=true`;
    memberPhoto.src   = member.photo;
    memberPhoto.alt   = member.name;
    memberPhoto.style.transform = member.photoScale ? `scale(${member.photoScale})` : "scale(1)";
    memberPhoto.style.transformOrigin = "bottom center";
    memberPhoto.onerror = function() {
      this.src = fallbackUrl;
    };

    // Update Thumbnail Active State
    const allThumbs = document.querySelectorAll(".thumb-item");
    allThumbs.forEach((t, i) => {
      t.classList.toggle("active", i === index);
    });

    // Ensure active thumbnail scrolls into view horizontally on smaller screens
    if (allThumbs[index]) {
      allThumbs[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  if (animate) {
    slideContent.classList.add("fade-out");
    setTimeout(() => {
      performDOMUpdate();
      slideContent.classList.remove("fade-out");
      slideContent.classList.add("fade-in");
      setTimeout(() => slideContent.classList.remove("fade-in"), 350);
    }, 180);
  } else {
    performDOMUpdate();
  }
}

function goToSlide(index) {
  if (index === currentIndex) return;
  currentIndex = index;
  updateSlide(currentIndex, true);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % TEAM_MEMBERS.length;
  updateSlide(currentIndex, true);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length;
  updateSlide(currentIndex, true);
}

/* ==========================================================================
   AUTO-SLIDE TIMER (3 SECONDS)
   ========================================================================== */
function startAutoSlide() {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    if (isPlaying) {
      nextSlide();
    }
  }, SLIDE_INTERVAL_MS);
}

function resetAutoSlide() {
  if (!isPlaying) return;
  startAutoSlide();
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playIcon.textContent = "pause";
    btnTogglePlay.classList.remove("paused");
    startAutoSlide();
  } else {
    playIcon.textContent = "play_arrow";
    btnTogglePlay.classList.add("paused");
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }
}

/* ==========================================================================
   EVENT LISTENERS (ARROWS, KEYS)
   ========================================================================== */
function setupEventListeners() {
  btnNext.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  btnPrev.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  btnTogglePlay.addEventListener("click", () => {
    togglePlayPause();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === " ") {
      // Don't scroll page when space is pressed on body
      if (document.activeElement === document.body) {
        e.preventDefault();
        togglePlayPause();
      }
    }
  });
}
