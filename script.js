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

document.getElementById('sendButton').addEventListener('click', () => {
    sendPhotoToBot();
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram.WebApp) {
        // Устанавливаем кнопку основного действия (Main Button)
        Telegram.WebApp.MainButton.show(); // Показываем кнопку
        Telegram.WebApp.MainButton.setText('Отправить'); // Устанавливаем текст кнопки
        Telegram.WebApp.MainButton.onClick(() => { // Обработчик нажатия кнопки
            // Вы можете добавить здесь вашу логику для обработки нажатия кнопки
            console.log('Кнопка отправить была нажата');
        });

        // Настраиваем кнопку в зависимости от текущего состояния Mini App
        Telegram.WebApp.onEvent('viewportChanged', event => {
            if (event.isStateStable) {
                Telegram.WebApp.MainButton.setParams({
                    isVisible: true // Убедитесь, что кнопка видима, когда Mini App находится в стабильном состоянии
                });
            }
        });

        // Если нужно, расширяем Mini App до максимальной доступной высоты
        Telegram.WebApp.expand();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram.WebApp) {
        // Расширение Mini App до полной высоты
        window.Telegram.WebApp.expand();

        // Доступ к различным данным
        // const initData = window.Telegram.WebApp.initData; // Сырые данные
        // const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe; // Ненадежные данные
        // const version = window.Telegram.WebApp.version; // Версия Bot API
        // ...и так далее для других полей

        // Используйте эти данные в соответствии с вашими потребностями
    }
});

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
    const imageData = canvas.toDataURL('image/png');

    document.getElementById('previewImage').src = imageData;
    showScreen('previewScreen');
}

function sendPhotoToBot() {
    const imageData = document.getElementById('previewImage').src;
    const chat_id = getChatId(); // Получаем chat_id динамически
    const bot_token = '6939402556:AAHW_lZWPrMHwVJlLK8r2Io7jVQfYZaaSlo'; // Токен вашего Telegram бота
    const telegram_api_url = `https://api.telegram.org/bot${bot_token}/sendPhoto`;

    let formData = new FormData();
    formData.append('1277274408', chat_id);
    formData.append('photo', imageData);

    fetch(telegram_api_url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Изображение отправлено в бота', data);
    })
    .catch(error => {
        console.error('Ошибка при отправке изображения в бота', error);
    });
}
function getChatId() {
    // Ваш код для получения chat_id, например, из URL или временного хранилища
}
