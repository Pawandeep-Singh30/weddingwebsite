/**
 * Luxury Punjabi Wedding Website - Main JavaScript
 * Countdown timer, gallery slider, music, and RSVP form
 */

// Countdown to 16 January 2027
let weddingDate = new Date("January 16, 2027 00:00:00").getTime();

setInterval(function () {
    let now = new Date().getTime();
    let gap = weddingDate - now;

    let days = Math.floor(gap / (1000 * 60 * 60 * 24));
    let hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((gap % (1000 * 60)) / 1000);

    var dEl = document.getElementById("days");
    var hEl = document.getElementById("hours");
    var mEl = document.getElementById("minutes");
    var sEl = document.getElementById("seconds");

    if (dEl) dEl.innerText = days < 10 ? "0" + days : days;
    if (hEl) hEl.innerText = hours < 10 ? "0" + hours : hours;
    if (mEl) mEl.innerText = minutes < 10 ? "0" + minutes : minutes;
    if (sEl) sEl.innerText = seconds < 10 ? "0" + seconds : seconds;
}, 1000);

document.addEventListener('DOMContentLoaded', function () {

/**
 * Invitation Opening Overlay
 */
var overlay = document.getElementById('invitation-overlay');
var openBtn = document.getElementById('open-invitation');
if (overlay && openBtn) {
    openBtn.addEventListener('click', function () {
        overlay.classList.add('hidden');
    });
}

/**
 * Gold Glitter Sparkles
 */
function createSparkles() {
    var container = document.getElementById('sparkles-container');
    if (!container) return;
    for (var i = 0; i < 25; i++) {
        var sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 20 + 's';
        sparkle.style.animationDuration = (18 + Math.random() * 8) + 's';
        container.appendChild(sparkle);
    }
}
createSparkles();

/**
 * Photo Gallery Slider
 */
const slides = document.querySelectorAll('.gallery-slide');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
const dotsContainer = document.getElementById('gallery-dots');

let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    document.querySelectorAll('.gallery-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Create dot indicators
if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `View slide ${i + 1}`);
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
    }
}

if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

// Scroll-triggered animations
const animatedElements = document.querySelectorAll('.animate-slide-up');
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
animatedElements.forEach(el => animationObserver.observe(el));

// Auto-advance slider
let slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);

/**
 * Background Music - play/pause on click (no autoplay)
 */
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

if (bgMusic && musicToggle) {
    function updateButtonState() {
        musicToggle.classList.toggle('playing', !bgMusic.paused);
    }

    bgMusic.addEventListener('play', updateButtonState);
    bgMusic.addEventListener('pause', updateButtonState);
    updateButtonState();

    musicToggle.addEventListener('click', function () {
        if (bgMusic.paused) {
            bgMusic.play().catch(function () {});
        } else {
            bgMusic.pause();
        }
    });
}

/**
 * RSVP Form - Name, Attendance Yes/No, Message
 */
const rsvpForm = document.querySelector('.rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked');
        const message = document.getElementById('message').value;

        const attendanceText = attendance && attendance.value === 'yes' ? 'attending' : 'not attending';
        alert(`Thank you, ${name}! Your RSVP has been received. You indicated you will be ${attendanceText}. We look forward to celebrating with you!`);

        rsvpForm.reset();
    });
}

/**
 * Guest Wishes Message Board
 */
var WISHES_KEY = 'wedding_guest_wishes';
function loadWishes() {
    try {
        return JSON.parse(localStorage.getItem(WISHES_KEY) || '[]');
    } catch (e) {
        return [];
    }
}
function saveWishes(wishes) {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
}
function renderWishes() {
    var board = document.getElementById('wishes-board');
    var wishes = loadWishes();
    if (!board) return;
    board.innerHTML = '';
    if (wishes.length === 0) {
        board.innerHTML = '<p class="wishes-empty">No wishes yet. Be the first to leave one!</p>';
        return;
    }
    wishes.slice().reverse().forEach(function (w) {
        var card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = '<div class="wish-name">' + escapeHtml(w.name) + '</div><div class="wish-message">' + escapeHtml(w.message) + '</div>';
        board.appendChild(card);
    });
}
function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
var wishesForm = document.getElementById('wishes-form');
if (wishesForm) {
    renderWishes();
    wishesForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('guest-name').value.trim();
        var message = document.getElementById('guest-message').value.trim();
        if (!name || !message) return;
        var wishes = loadWishes();
        wishes.push({ name: name, message: message, time: Date.now() });
        saveWishes(wishes);
        renderWishes();
        wishesForm.reset();
    });
}

}); // end DOMContentLoaded
