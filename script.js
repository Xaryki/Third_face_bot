document.getElementById('startButton').addEventListener('click', () => {
    showScreen('cameraScreen');
    startCamera();
});

document.getElementById('nextButton').addEventListener('click', () => {
    Telegram.WebApp.sendData(capturedImageData);
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





function loadFaceApiModels() {
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('https://vladmandic.github.io/face-api/model/tiny_face_detector_model-weights_manifest.json'),
        faceapi.nets.faceLandmark68Net.loadFromUri('https://vladmandic.github.io/face-api/model/face_landmark_68_model-weights_manifest.json')
    ]);
}


let hatImage = null;

function preloadHatImage() {
    hatImage = new Image();
    hatImage.src = 'hat.png'; // Убедитесь, что путь к изображению шапки указан правильно
}

function drawChristmasHat(canvas, detections) {
    const ctx = canvas.getContext('2d');

    if (!hatImage) {
        console.error("Изображение шапки не загружено");
        return;
    }

    detections.forEach(detection => {
        const { x, y, width, height } = detection.detection.box;

        const hatWidth = width;
        const hatHeight = hatWidth * 0.7;
        const hatX = x;
        const hatY = y - hatHeight * 0.6;

        ctx.drawImage(hatImage, hatX, hatY, hatWidth, hatHeight);
    });
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

