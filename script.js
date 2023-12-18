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
        // Скрываем основную кнопку до нажатия кнопки "Сделать фото"
        Telegram.WebApp.MainButton.hide();

        // Получаем элемент кнопки "Сделать фото" в вашем HTML
        const captureButton = document.getElementById('captureButton');
        
        // Добавляем обработчик события на кнопку "Сделать фото"
        captureButton.addEventListener('click', function() {
            // Логика для захвата фотографии
            // ...

            // После захвата фото, показываем основную кнопку
            Telegram.WebApp.MainButton.show();
            Telegram.WebApp.MainButton.setText('Отправить');
            Telegram.WebApp.MainButton.onClick(() => {
                // Логика отправки фотографии или другого действия
                console.log('Кнопка отправить была нажата');
                // Вызовите здесь функцию для отправки фотографии
            });
        });
        
        // Настраиваем остальную логику Mini App, если необходимо
        // ...
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
