document.getElementById('startButton').addEventListener('click', () => {
    showScreen('instructionScreen');
});

document.getElementById('nextButton').addEventListener('click', () => {
    showScreen('cameraScreen');
    startCamera();
});

document.getElementById('captureButton').addEventListener('click', () => {
    capturePhoto();
});


document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram.WebApp) {
        // Расширение Mini App до полной высоты
        window.Telegram.WebApp.expand();
        Telegram.WebApp.MainButton.hide();

        const captureButton = document.getElementById('captureButton');
        captureButton.addEventListener('click', function() {
            capturedImageData = /* захват данных фотографии */;
            Telegram.WebApp.MainButton.show();
            Telegram.WebApp.MainButton.setText('Отправить');
        });

        Telegram.WebApp.MainButton.onClick(() => {
            if (capturedImageData) {
                console.log('Кнопка отправить была нажата');
                Telegram.WebApp.sendData(capturedImageData);
            }
        });
    }
});

let capturedImageData = null; // Глобальная переменная для хранения данных изображения

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
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
    canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Конвертация изображения в строку base64 и сохранение данных
    capturedImageData = canvas.toDataURL('image/png');

    // Отображение захваченного изображения
    const previewImage = document.getElementById('previewImage');
    previewImage.src = capturedImageData;

    // Показать экран предпросмотра
    showScreen('previewScreen');
}
