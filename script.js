document.getElementById('startButton').addEventListener('click', () => {
    showScreen('cameraScreen');
    startCamera();
});

document.getElementById('nextButton').addEventListener('click', () => {
    Telegram.WebApp.sendData(capturedImageData);
});

let capturedImageData = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.MainButton.hide();
        Telegram.WebApp.expand();

        // Настройка MainButton
        Telegram.WebApp.MainButton.onClick(() => {
            Telegram.WebApp.close(); // Закрыть Mini App при нажатии на MainButton
        });

        Telegram.WebApp.enableClosingConfirmation();
    }
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

function startCamera() {
    const videoElement = document.getElementById('video');
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.log("Ошибка при доступе к камере: ", error);
            });
    }
}

function capturePhoto() {
    const videoElement = document.getElementById('video');
    const canvas = document.createElement('canvas');

    // Уменьшение размеров холста для снижения размера изображения
    const scale = 0.5; // Масштабирование изображения до 50%
    canvas.width = videoElement.videoWidth * scale;
    canvas.height = videoElement.videoHeight * scale;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Конвертация в Base64 с уменьшенным качеством
    const quality = 0.7; // 70% качество
    const base64Image = canvas.toDataURL('image/png', quality);

    // Удаление префикса Base64
    const base64Data = base64Image.split(',')[1];

    capturedImageData = base64Data;
    

    const previewImage = document.getElementById('previewImage');
    previewImage.src = base64Image;

    showScreen('previewScreen');

    return base64Data;
}

