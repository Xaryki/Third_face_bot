document.getElementById('startButton').addEventListener('click', () => {
    showScreen('nextButton');
    startCamera();
});

document.getElementById('nextButton').addEventListener('click', () => {
    showScreen('cameraScreen');
    startCamera();
});

document.addEventListener('DOMContentLoaded', function() {
    preloadHatImage();
    // ... Остальной код ...
});

let capturedImageData = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.MainButton.hide();
        Telegram.WebApp.expand();

        const captureButton = document.getElementById('captureButton');
        captureButton.addEventListener('click', function() {
            capturedImageData = capturePhoto();
            Telegram.WebApp.MainButton.show();
            Telegram.WebApp.MainButton.setText('Отправить');
        });

        Telegram.WebApp.MainButton.onClick(() => {
            if (capturedImageData) {
                Telegram.WebApp.close(); // Закрыть Mini App при нажатии на MainButton
            }
        });

        const themeParams = window.Telegram.WebApp.themeParams;
        Telegram.WebApp.setHeaderColor(themeParams.bg_color);
        Telegram.WebApp.setBackgroundColor(themeParams.secondary_bg_color);

        Telegram.WebApp.onEvent('viewportChanged', (event) => {
            if (event.isStateStable) {
                // Обработка изменения видимой области
            }
        });
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
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    loadFaceApiModels()
        .then(() => faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks())
        .then(detections => {
            drawChristmasHat(canvas, detections);

            const previewImage = document.getElementById('previewImage');
            previewImage.src = canvas.toDataURL();

            return canvas.toDataURL();
        })
        .then(dataUrl => {
            capturedImageData = dataUrl;
        })
        .catch(error => {
            console.error('Ошибка при распознавании лиц:', error);
        });
}

