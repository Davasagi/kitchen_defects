const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalVideo = document.getElementById("modal-video");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const downloadLink = document.getElementById("download-link"); // ссылка "Скачать"

// Единый массив всех медиа (фото и видео) в порядке на странице
const media = Array.from(document.querySelectorAll('img.clickable, video.clickable'));
let currentIndex = 0;

function updateModalMedia() {
    const currentMedia = media[currentIndex];
    if (currentMedia.tagName === 'IMG') {
        modalImg.style.display = "block";
        modalVideo.style.display = "none";
        modalImg.src = currentMedia.src;
        downloadLink.href = currentMedia.src;
        downloadLink.setAttribute("download", `image_${currentIndex + 1}.jpeg`);
    } else if (currentMedia.tagName === 'VIDEO') {
        modalImg.style.display = "none";
        modalVideo.style.display = "block";
        modalVideo.src = currentMedia.src;
        downloadLink.href = currentMedia.src;
        downloadLink.setAttribute("download", `video_${currentIndex + 1}.mov`);
    }
}

function openModal(index) {
    currentIndex = index;
    updateModalMedia();
    modal.style.display = "block";
    document.body.classList.add('modal-open');
}

function showNext() {
    currentIndex = (currentIndex + 1) % media.length;
    updateModalMedia();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + media.length) % media.length;
    updateModalMedia();
}

// Навешиваем обработчики на все медиа
media.forEach((el, index) => {
    el.addEventListener("click", () => openModal(index));
});

// Закрытие
closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.classList.remove('modal-open');
};
modal.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }
};

// Навигация
nextBtn.onclick = showNext;
prevBtn.onclick = showPrev;

document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "Escape") {
            modal.style.display = "none";
            document.body.classList.remove('modal-open');
        }
    }
});

// Создание превью для видео (оставляем как было)
const videos = Array.from(document.querySelectorAll("video.clickable"));
videos.forEach(video => {
    video.addEventListener('loadedmetadata', function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Берём кадр из середины видео
        const middle = video.duration / 2;
        video.currentTime = middle;
        video.addEventListener('seeked', function() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const posterUrl = canvas.toDataURL('image/jpeg');
            video.poster = posterUrl;
        }, { once: true });
    });
});

// Прокрутка мыши для перелистывания медиа (горизонтальный скролл)
modal.addEventListener('wheel', function(e) {
    if (modal.style.display === "block") {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { // реагируем только на горизонтальный скролл
            e.preventDefault();
            if (e.deltaX > 0) {
                showNext();
            } else if (e.deltaX < 0) {
                showPrev();
            }
        }
    }
}, { passive: false });

// Свайп для мобильных устройств
let touchStartX = null;
modal.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
    }
});
modal.addEventListener('touchend', function(e) {
    if (touchStartX === null) return;
    let touchEndX = e.changedTouches[0].clientX;
    let dx = touchEndX - touchStartX;
    if (Math.abs(dx) > 40) { // порог для свайпа
        if (dx < 0) {
            showNext();
        } else {
            showPrev();
        }
    }
    touchStartX = null;
});
