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
    faceapi.nets.tinyFaceDetector.loadFromUri('https://vladmandic.github.io/face-api/model/tiny_face_detector_model-weights_manifest.json')
        .then(() => faceapi.nets.faceLandmark68Net.loadFromUri('https://vladmandic.github.io/face-api/model/face_landmark_68_model-weights_manifest.json'))
        .then(() => {
            // Модели загружены, можно выполнить следующие действия
        });
}

// Функция для рисования новогодней шапки на обнаруженных лицах
function drawChristmasHat(canvas, detections) {
    const ctx = canvas.getContext('2d');
    
    detections.forEach(detection => {
        const { x, y, width } = detection.detection.box;

        const hatWidth = width;
        const hatHeight = hatWidth * 0.7;
        const hatX = x;
        const hatY = y - hatHeight * 0.6;

        // Загружаем изображение шапки
        const hatImage = new Image();
        hatImage.src = 'hat.png'; // Убедитесь, что путь к изображению шапки указан правильно

        hatImage.onload = () => {
            ctx.drawImage(hatImage, hatX, hatY, hatWidth, hatHeight);
        };
    });
}


// Функция захвата фото
function capturePhoto() {
    const videoElement = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Загружаем модели и выполняем распознавание лиц
    loadFaceApiModels().then(() => {
        faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .then(detections => {
                drawChristmasHat(canvas, detections);
                
                // Обновляем предварительный просмотр изображения
                const previewImage = document.getElementById('previewImage');
                previewImage.src = canvas.toDataURL();
            })
            .catch(error => {
                console.error('Ошибка при распознавании лиц:', error);
            });
    });
}
