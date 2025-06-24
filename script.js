const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const downloadLink = document.getElementById("download-link"); // ссылка "Скачать"
const images = Array.from(document.querySelectorAll("img.clickable"));
const videos = Array.from(document.querySelectorAll("video.clickable"));
const modalVideo = document.getElementById("modal-video");

let currentIndex = 0;
let currentMedia = null;

function updateModalMedia() {
    // Определяем, что открывать: картинку или видео
    if (images.includes(currentMedia)) {
        modalImg.style.display = "block";
        modalVideo.style.display = "none";
        modalImg.src = currentMedia.src;
        downloadLink.href = currentMedia.src;
        downloadLink.setAttribute("download", `image_${currentIndex + 1}.jpeg`);
    } else if (videos.includes(currentMedia)) {
        modalImg.style.display = "none";
        modalVideo.style.display = "block";
        modalVideo.src = currentMedia.src;
        downloadLink.href = currentMedia.src;
        downloadLink.setAttribute("download", `video_${currentIndex + 1}.mov`);
    }
}

function openModal(index, type) {
    currentIndex = index;
    if (type === 'image') {
        currentMedia = images[index];
    } else {
        currentMedia = videos[index];
    }
    updateModalMedia();
    modal.style.display = "block";
}

function showNext() {
    let arr = images.includes(currentMedia) ? images : videos;
    currentIndex = (currentIndex + 1) % arr.length;
    currentMedia = arr[currentIndex];
    updateModalMedia();
}

function showPrev() {
    let arr = images.includes(currentMedia) ? images : videos;
    currentIndex = (currentIndex - 1 + arr.length) % arr.length;
    currentMedia = arr[currentIndex];
    updateModalMedia();
}

// Открытие при клике на фото
images.forEach((img, index) => {
    img.addEventListener("click", () => openModal(index, 'image'));
});
videos.forEach((vid, index) => {
    vid.addEventListener("click", () => openModal(index, 'video'));
});

// Закрытие
closeBtn.onclick = () => modal.style.display = "none";
modal.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
};

// Навигация
nextBtn.onclick = showNext;
prevBtn.onclick = showPrev;

// Стрелки клавиатуры
document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "Escape") modal.style.display = "none";
    }
});
