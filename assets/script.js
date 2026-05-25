// ================= GALLERY MUSIC FUNCTIONALITY =================
let currentlyPlayingAudio = null;

document.querySelectorAll(".gallery-item").forEach((item, index) => {
  const songUrl = item.getAttribute("data-song");
  const audioElement = item.querySelector(".gallery-audio");

  if (audioElement) {
    audioElement.src = songUrl;

    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Stop any currently playing audio
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audioElement) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.currentTime = 0;
      }

      // Toggle current audio
      if (audioElement.paused) {
        audioElement.play().catch((err) => {
          console.log("Audio play error:", err);
          showStatus("Audio playback not available", "error");
        });
        currentlyPlayingAudio = audioElement;
        item.classList.add("playing");
      } else {
        audioElement.pause();
        audioElement.currentTime = 0;
        item.classList.remove("playing");
        currentlyPlayingAudio = null;
      }
    });

    // Remove playing class when audio ends
    audioElement.addEventListener("ended", () => {
      item.classList.remove("playing");
      currentlyPlayingAudio = null;
    });
  }
});

// Stop gallery music when clicking other items
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".gallery-item") &&
    !e.target.closest(".gallery-audio")
  ) {
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.classList.remove("playing");
      });
      currentlyPlayingAudio = null;
    }
  }
});

// ================= AOS INITIALIZATION =================
AOS.init({
  duration: 1200,
  once: true,
  offset: 100,
});

// ================= LOADER =================
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 1000);
  }, 3000);
});

// ================= GSAP ANIMATIONS =================
// gsap.from(".main-title", {
//   y: 100,
//   opacity: 0,
//   duration: 1.5,
// });

// gsap.from(".subtitle", {
//   y: 50,
//   opacity: 0,
//   duration: 1,
//   delay: 1,
// });

// ================= MOBILE MENU TOGGLE =================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = navMenu.classList.contains("active")
      ? "rotate(45deg) translate(10px, 10px)"
      : "";
    spans[1].style.opacity = navMenu.classList.contains("active") ? "0" : "1";
    spans[2].style.transform = navMenu.classList.contains("active")
      ? "rotate(-45deg) translate(8px, -8px)"
      : "";
  });

  // Close menu when link is clicked
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const spans = menuToggle.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "";
    });
  });
}

// ================= CURSOR GLOW EFFECT =================
document.addEventListener("mousemove", (e) => {
  const cursorGlow = document.querySelector(".cursor-glow");
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX - 15 + "px";
    cursorGlow.style.top = e.clientY - 15 + "px";
  }
});

// ================= PARTICLE GENERATION =================
const particlesContainer = document.querySelector(".particles");
if (particlesContainer) {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.width = Math.random() * 3 + 1 + "px";
    particle.style.height = particle.style.width;
    particle.style.background = `hsl(${Math.random() * 60 + 330}, 100%, 50%)`;
    particle.style.borderRadius = "50%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.pointerEvents = "none";
    particle.style.animation = `particleFloat ${Math.random() * 20 + 10}s linear infinite`;
    particle.style.filter = "blur(1px)";
    particlesContainer.appendChild(particle);
  }

  const style = document.createElement("style");
  style.textContent = `
        @keyframes particleFloat {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { transform: translate(${Math.random() * 200 - 100}px, -${Math.random() * 200}px) rotate(360deg); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
}

// ================= WISH FUNCTIONALITY =================
const voiceBtn = document.getElementById("voiceBtn");
const wishInput = document.getElementById("wishInput");
const checkBtn = document.getElementById("checkBtn");
const wishStatus = document.getElementById("wishStatus");

// Voice recognition setup
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let isRecording = false;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  voiceBtn.addEventListener("click", () => {
    if (!isRecording) {
      isRecording = true;
      voiceBtn.classList.add("recording");
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
      recognition.start();
    } else {
      isRecording = false;
      voiceBtn.classList.remove("recording");
      voiceBtn.innerHTML =
        '<i class="fas fa-microphone"></i> Click & Say: "Makley"';
      recognition.stop();
    }
  });

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    wishInput.value = transcript;
    checkWish(transcript);
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove("recording");
    voiceBtn.innerHTML =
      '<i class="fas fa-microphone"></i> Click & Say: "Makley"';
    isRecording = false;
    showStatus("Error recognizing speech. Try again or type instead.", "error");
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    voiceBtn.innerHTML =
      '<i class="fas fa-microphone"></i> Click & Say: "Makley"';
    isRecording = false;
  };
} else {
  if (voiceBtn) voiceBtn.style.display = "none";
}

// Check wish text
function checkWish(text) {
  const lowerText = text.toLowerCase().trim();
  if (lowerText.includes("Makley") || lowerText.includes("makley")) {
    showStatus("💖I Love You! Your wish has been unlocked!", "success");
    triggerCelebration();
    setTimeout(() => {
      showSecretMessage();
    }, 1500);
  } else {
    showStatus("❤️ Say 'Makley' to unlock the surprise...", "error");
  }
}

// Check button functionality
if (checkBtn) {
  checkBtn.addEventListener("click", () => {
    const text = wishInput.value.trim();
    if (text) {
      checkWish(text);
    } else {
      showStatus("Please enter or say something!", "error");
    }
  });

  // Allow Enter key to submit
  if (wishInput) {
    wishInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        checkBtn.click();
      }
    });
  }
}

function showStatus(message, type) {
  wishStatus.textContent = message;
  wishStatus.className = `wish-status ${type}`;
  if (type === "error") {
    setTimeout(() => {
      wishStatus.textContent = "";
      wishStatus.className = "wish-status";
    }, 3000);
  }
}

function triggerCelebration() {
  // Create confetti effect
  const wishBox = document.querySelector(".wish-box");
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.background = ["#ff3d81", "#ff7096", "#ffd4e5"][
      Math.floor(Math.random() * 3)
    ];
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "50%";
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = 1;

    wishBox.appendChild(confetti);

    gsap.to(confetti, {
      y: Math.random() * 300 - 150,
      x: Math.random() * 300 - 150,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => confetti.remove(),
    });
  }
}
function showSecretMessage() {
  const secretMsg = document.createElement("div");

  secretMsg.classList.add("birthday-modal");

  secretMsg.innerHTML = `
        <p class="title">🎂 Happy Birthday Prathee 💖</p>
        <p class="message">
            On this special day, I just want to remind you how deeply you are loved.<br><br>
            You are my happiness, my peace, and my forever reason to smile.<br><br>
            Love you as you are, always and endlessly. 💕
        </p>
    `;

  document.body.appendChild(secretMsg);

  setTimeout(() => {
    gsap.to(secretMsg, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      onComplete: () => secretMsg.remove(),
    });
  }, 4000);
}

// ================= TYPEWRITER EFFECT =================
const typewriterElement = document.getElementById("typewriter");
const typewriterText = `Dear My Love,

From the moment I saw your smile on June 1st, 2022, I knew my life was going to change forever. And when you said "Yes" on June 7th, 2022, I became the happiest person alive.

Every day with you feels like a dream come true. You are my everything – my love, my life, my reason to smile. Your presence makes the ordinary moments become extraordinary.

Thank you for filling my life with love, laughter, and endless beautiful memories. I promise to love you more and more with each passing day.

Happy Birthday to the love of my life!

Forever yours,
Your Love ❤️`;

function typeWriter() {
  if (!typewriterElement) return;

  let i = 0;
  function type() {
    if (i < typewriterText.length) {
      typewriterElement.innerHTML += typewriterText.charAt(i);
      i++;
      setTimeout(type, 30);
    }
  }
  type();
}

// Wait for element to be visible before starting typewriter
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (
      entry.isIntersecting &&
      typewriterElement &&
      typewriterElement.innerHTML === ""
    ) {
      typeWriter();
      observer.unobserve(entry.target);
    }
  });
});

if (typewriterElement) {
  observer.observe(typewriterElement);
}

// ================= MUSIC CONTROLS =================
// const musicBtn = document.getElementById("musicBtn");
// const bgMusic = document.getElementById("bgMusic");

// if (musicBtn && bgMusic) {
//   musicBtn.addEventListener("click", () => {
//     if (bgMusic.paused) {
//       bgMusic.play();
//       musicBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
//     } else {
//       bgMusic.pause();
//       musicBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
//     }
//   });
// }
const musicBtn = document.getElementById("musicBtn");
const videoModal = document.getElementById("videoModal");
const closeVideo = document.getElementById("closeVideo");
const video = document.getElementById("birthdayVideo");

// OPEN VIDEO
musicBtn.addEventListener("click", () => {
  videoModal.style.display = "flex";
  video.play();
});

// CLOSE VIDEO
closeVideo.addEventListener("click", () => {
  video.pause();
  video.currentTime = 0;
  videoModal.style.display = "none";
});

// CLOSE ON BACKDROP CLICK
videoModal.addEventListener("click", (e) => {
  if (e.target === videoModal) {
    video.pause();
    video.currentTime = 0;
    videoModal.style.display = "none";
  }
});
// ================= SURPRISE BUTTON =================
const surpriseBtn = document.getElementById("surpriseBtn");
if (surpriseBtn) {
  surpriseBtn.addEventListener("click", () => {
    // Scroll to wish section
    const wishSection = document.getElementById("wish");
    if (wishSection) {
      wishSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ================= NAVBAR SCROLL EFFECT =================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.1)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.05)";
    }
  }
});

// ================= COUNTER ANIMATION =================
const counter = document.getElementById("counter");
if (counter) {
  let count = 0;
  const target = 1428; // Days from June 1, 2022 to May 21, 2026
  const increment = target / 60; // Animate over ~60 frames

  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && count === 0) {
        const interval = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(interval);
          }
          counter.innerHTML = Math.floor(count);
        }, 30);
        observer2.unobserve(entry.target);
      }
    });
  });

  observer2.observe(counter);
}

// ================= INITIALIZE ON DOM READY =================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Website loaded! 💖");
});
const giftBox = document.getElementById("giftBox");
const giftModal = document.getElementById("giftModal");
const giftReveal = document.getElementById("giftReveal");

const correctPassword = "2004"; // change this

giftBox.addEventListener("click", () => {
  giftModal.style.display = "flex";
});

function checkGiftPassword() {
  const input = document.getElementById("giftPassword").value;
  const error = document.getElementById("giftError");

  if (input === correctPassword) {
    giftModal.style.display = "none";

    giftReveal.style.display = "flex";

    const audio = document.getElementById("giftMusic");
    audio.play();

    gsap.from(".reveal-card", {
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  } else {
    error.innerText = "❌ Wrong password, try again ❤️";
  }
}

// close modal on outside click
giftModal.addEventListener("click", (e) => {
  if (e.target === giftModal) {
    giftModal.style.display = "none";
  }
});

// close reveal on click
giftReveal.addEventListener("click", () => {
  giftReveal.style.display = "none";
});
