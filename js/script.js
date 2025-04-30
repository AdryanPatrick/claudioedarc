// Configurações iniciais
const config = {
  proposalDate: new Date('May 01, 2025 00:00:00').getTime(),
  datingStartDate: new Date('May 01, 2025 16:00:00').getTime(),
  carouselIntervalTime: 5000,
  heartCreationInterval: 300,
  confettiCount: 150
};

// Elementos DOM
const elements = {
  audioPlayer: document.getElementById('audio-player'),
  audioPlayer2: document.getElementById('audio-player-2'),
  playBtn: document.getElementById('play-btn'),
  playBtn2: document.getElementById('play-btn-2'),
  proposalContainer: document.getElementById('proposal-container'),
  countdownContainer: document.getElementById('countdown-container'),
  confirmationContainer: document.getElementById('confirmation-container'),
  carousel: document.querySelector('.couple-carousel'),
  slides: document.querySelectorAll('.carousel-slide'),
  dotsContainer: document.querySelector('.carousel-dots'),
  datingCounter: document.getElementById('dating-counter'),
  proposalBtn: document.getElementById('proposal-btn'),
  restartBtn: document.getElementById('restart-btn'),
  volumeSlider: document.getElementById('volume-slider'),
  volumeSlider2: document.getElementById('volume-slider-2'),
  body: document.body
};

// Estado da aplicação
let state = {
  currentIndex: 0,
  carouselInterval: null,
  isPlaying: false,
  isPlaying2: false,
  heartsInterval: null,
  confettiInterval: null
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Função de inicialização principal
function init() {
  setupEventListeners();
  createCarouselDots();
  updateDatingCounter();
  startCountdown();
  startCarousel();
  
  // Configura volumes iniciais (sem iniciar automaticamente)
  elements.audioPlayer.volume = 0.7;
  elements.audioPlayer2.volume = 0.7;
  elements.volumeSlider.value = 0.7;
  elements.volumeSlider2.value = 0.7;
}

// Configura listeners de eventos
function setupEventListeners() {
  // Controles de áudio
  elements.playBtn.addEventListener('click', () => toggleAudio(1));
  elements.playBtn2.addEventListener('click', () => toggleAudio(2));
  
  // Controles de volume
  elements.volumeSlider.addEventListener('input', () => {
    elements.audioPlayer.volume = elements.volumeSlider.value;
  });
  
  elements.volumeSlider2.addEventListener('input', () => {
    elements.audioPlayer2.volume = elements.volumeSlider2.value;
  });
  
  // Botão de proposta
  elements.proposalBtn.addEventListener('click', showConfirmation);
  elements.restartBtn.addEventListener('click', restartExperience);
  
  // Pausa carrossel quando o mouse está sobre ele
  elements.carousel.addEventListener('mouseenter', stopCarousel);
  elements.carousel.addEventListener('mouseleave', startCarousel);
}

// Alterna o áudio (1 para primeira música, 2 para segunda)
function toggleAudio(playerNum) {
  if (playerNum === 1) {
    if (state.isPlaying) {
      elements.audioPlayer.pause();
      elements.playBtn.textContent = '▶';
      state.isPlaying = false;
    } else {
      stopAllAudio();
      elements.audioPlayer.currentTime = 0;
      elements.audioPlayer.play()
        .then(() => {
          state.isPlaying = true;
          elements.playBtn.textContent = '❚❚';
        })
        .catch(e => console.log("Erro ao reproduzir música:", e));
    }
  } else if (playerNum === 2) {
    if (state.isPlaying2) {
      elements.audioPlayer2.pause();
      elements.playBtn2.textContent = '▶';
      state.isPlaying2 = false;
    } else {
      stopAllAudio();
      elements.audioPlayer2.currentTime = 0;
      elements.audioPlayer2.play()
        .then(() => {
          state.isPlaying2 = true;
          elements.playBtn2.textContent = '❚❚';
        })
        .catch(e => console.log("Erro ao reproduzir música:", e));
    }
  }
}

// Para todas as músicas
function stopAllAudio() {
  if (state.isPlaying) {
    elements.audioPlayer.pause();
    elements.audioPlayer.currentTime = 0;
    elements.playBtn.textContent = '▶';
    state.isPlaying = false;
  }
  if (state.isPlaying2) {
    elements.audioPlayer2.pause();
    elements.audioPlayer2.currentTime = 0;
    elements.playBtn2.textContent = '▶';
    state.isPlaying2 = false;
  }
}

// Contagem regressiva
function startCountdown() {
  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = config.proposalDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      showProposalPage();
      return;
    }

    updateCountdownDisplay(distance);
  }, 1000);
}

// Atualiza o display da contagem regressiva
function updateCountdownDisplay(distance) {
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Mostra a página de proposta
function showProposalPage() {
  elements.countdownContainer.style.display = 'none';
  elements.proposalContainer.style.display = 'block';
  elements.body.style.background = 'linear-gradient(135deg, #FF6B8B 0%, #5D9CEC 100%)';
  
  stopAllAudio();
  
  // Inicia a segunda música automaticamente na página de proposta
  elements.audioPlayer2.currentTime = 0;
  elements.audioPlayer2.play()
    .then(() => {
      state.isPlaying2 = true;
      elements.playBtn2.textContent = '❚❚';
    })
    .catch(e => console.log("Erro ao reproduzir música 2:", e));
  
  initFallingHearts();
  animateProposalElements();
}

// Anima elementos na página de proposta
function animateProposalElements() {
  gsap.from('.proposal-header h2', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'power3.out'
  });
  
  gsap.from('.subtitle', {
    duration: 1,
    delay: 0.3,
    y: -20,
    opacity: 0,
    ease: 'power2.out'
  });
  
  gsap.from('.couple-carousel-container', {
    duration: 1,
    delay: 0.6,
    scale: 0.9,
    opacity: 0,
    ease: 'back.out(1.7)'
  });
  
  gsap.from('.dating-info', {
    duration: 1,
    delay: 0.9,
    y: 20,
    opacity: 0,
    ease: 'power2.out'
  });
  
  gsap.from('.proposal-button', {
    duration: 1,
    delay: 1.5,
    scale: 0,
    opacity: 0,
    ease: 'elastic.out(1, 0.5)'
  });
}

// Mostra a confirmação
function showConfirmation() {
  elements.proposalContainer.style.display = 'none';
  elements.confirmationContainer.style.display = 'block';
  createConfetti();
}

// Reinicia a experiência
function restartExperience() {
  elements.confirmationContainer.style.display = 'none';
  elements.countdownContainer.style.display = 'block';
  elements.body.style.background = '#F8F9FA';
  
  stopAllAudio();
  
  // Não inicia nenhuma música automaticamente ao reiniciar
  state.currentIndex = 0;
  updateCarousel();
  startCarousel();
  
  startCountdown();
  stopFallingHearts();
  stopConfetti();
}

// Funções do carrossel vertical
function createCarouselDots() {
  elements.slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    elements.dotsContainer.appendChild(dot);
  });
}

function startCarousel() {
  stopCarousel();
  state.carouselInterval = setInterval(nextSlide, config.carouselIntervalTime);
}

function stopCarousel() {
  if (state.carouselInterval) {
    clearInterval(state.carouselInterval);
    state.carouselInterval = null;
  }
}

function nextSlide() {
  state.currentIndex = (state.currentIndex + 1) % elements.slides.length;
  updateCarousel();
}

function goToSlide(index) {
  state.currentIndex = index;
  updateCarousel();
}

function updateCarousel() {
  const translateValue = -state.currentIndex * 100 + '%';
  elements.carousel.style.transform = `translateY(${translateValue})`;
  
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === state.currentIndex);
  });
  
  stopCarousel();
  startCarousel();
}

// Atualiza o contador de namoro
function updateDatingCounter() {
  updateDatingCounterDisplay();
  setInterval(updateDatingCounterDisplay, 1000 * 60 * 60 * 24);
}

function updateDatingCounterDisplay() {
  const now = new Date().getTime();
  const difference = now - config.datingStartDate;
  const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
  
  if (elements.datingCounter) {
    elements.datingCounter.textContent = `Juntos há ${days + 1} dias e contando...`;
  }
}

// Animação de corações
function initFallingHearts() {
  stopFallingHearts();
  state.heartsInterval = setInterval(createHeart, config.heartCreationInterval);
}

function stopFallingHearts() {
  if (state.heartsInterval) {
    clearInterval(state.heartsInterval);
    state.heartsInterval = null;
  }
}

function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  document.body.appendChild(heart);
  
  heart.style.left = Math.random() * 100 + 'vw';
  const size = Math.random() * 20 + 10;
  heart.style.width = size + 'px';
  heart.style.height = size + 'px';
  heart.style.animationDuration = Math.random() * 5 + 5 + 's';
  heart.style.transform = `rotate(${Math.random() * 360}deg)`;
  
  heart.addEventListener('animationend', () => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart);
    }
  });
}

// Efeito de confete
function createConfetti() {
  stopConfetti();
  
  for (let i = 0; i < config.confettiCount; i++) {
    setTimeout(() => {
      createSingleConfetti();
    }, i * 20);
  }
  
  state.confettiInterval = setInterval(() => {
    createSingleConfetti();
  }, 100);
}

function stopConfetti() {
  if (state.confettiInterval) {
    clearInterval(state.confettiInterval);
    state.confettiInterval = null;
  }
  
  document.querySelectorAll('.confetti').forEach(confetti => {
    confetti.remove();
  });
}

function createSingleConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  document.body.appendChild(confetti);
  
  const colors = ['#FF6B8B', '#5D9CEC', '#FFD166', '#06D6A0', '#FFF'];
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
  const size = Math.random() * 15 + 5;
  confetti.style.width = size + 'px';
  confetti.style.height = size + 'px';
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.top = '-20px';
  
  const animationDuration = Math.random() * 3 + 2;
  const animationDelay = Math.random() * 2;
  const rotation = Math.random() * 360;
  
  gsap.to(confetti, {
    y: window.innerHeight + 20,
    rotation: rotation,
    duration: animationDuration,
    delay: animationDelay,
    ease: 'power1.out',
    onComplete: () => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }
  });
}