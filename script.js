// Scroll-triggered Video Playback
const video = document.getElementById('scroll-video');
const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

let lastScrollY = window.scrollY;
let ticking = false;
let videoDuration = 0;
let isVideoReady = false;

// Configuração: ajuste a velocidade do vídeo conforme o scroll
// Valor maior = vídeo avança mais rápido com menos scroll
const SCROLL_SPEED_MULTIPLIER = 3000; // pixels de scroll para percorrer todo o vídeo

// Inicializa o vídeo
video.addEventListener('loadedmetadata', () => {
    videoDuration = video.duration;
    isVideoReady = true;
    video.pause(); // Começa pausado
    updateVideoFromScroll(); // Posiciona no frame inicial
});

// Se o vídeo já estiver carregado (cache)
if (video.readyState >= 2) {
    videoDuration = video.duration;
    isVideoReady = true;
    video.pause();
}

function updateVideoFromScroll() {
    if (!isVideoReady || !videoDuration) return;
    
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calcula o progresso do scroll na seção hero (0 a 1)
    const maxScroll = heroHeight - windowHeight;
    const scrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
    
    // Define o tempo do vídeo baseado no progresso do scroll
    const targetTime = scrollProgress * videoDuration;
    
    // Atualiza o currentTime do vídeo
    if (Math.abs(video.currentTime - targetTime) > 0.1) {
        video.currentTime = targetTime;
    }
    
    // Fade out do conteúdo do hero conforme o scroll avança
    const fadeStart = 0.3; // Começa a desaparecer aos 30% do scroll
    if (scrollProgress > fadeStart) {
        const opacity = 1 - ((scrollProgress - fadeStart) / (1 - fadeStart));
        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translate(-50%, -50%) translateY(${scrollProgress * 50}px)`;
    } else {
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translate(-50%, -50%)';
    }
    
    // Esconde o vídeo quando sai da seção hero
    if (scrollProgress >= 0.98) {
        video.style.opacity = '0';
    } else {
        video.style.opacity = '1';
    }
}

// Scroll listener otimizado com requestAnimationFrame
window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateVideoFromScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Atualiza em resize
window.addEventListener('resize', () => {
    updateVideoFromScroll();
});

// Touch events para mobile (melhora a responsividade)
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateVideoFromScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Smooth scroll para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
