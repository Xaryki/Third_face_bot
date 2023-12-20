window.onload = function() {
    // Показать первый слайд при загрузке страницы
    goToSlide(1);
    Telegram.WebApp.expand();
};


window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    const canvasElement = document.getElementById('canvas');
    canvasElement.width = canvasElement.offsetWidth;
    canvasElement.height = canvasElement.offsetHeight;
}

function goToSlide(slideNumber) {
    // Скрыть все слайды
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = 'none';
    });

    // Показать выбранный слайд
    const selectedSlide = document.getElementById('slide' + slideNumber);
    selectedSlide.style.display = 'block';

   

}

function selectStyle(styleNumber) {
    // Удаление выделения со всех стилей
    document.querySelectorAll('.image-choice').forEach(choice => {
        choice.classList.remove('selected-style');
    });

    // Добавление выделения к выбранному стилю
    let selectedStyle = document.getElementById('style' + styleNumber);
    if (selectedStyle) {
        selectedStyle.classList.add('selected-style');
    }
    localStorage.setItem('selectedStyle', styleNumber);
    // Показ кнопок
    document.querySelector('.buttons').style.display = 'block';
}


document.getElementById('takePhoto').addEventListener('click', function() {
    window.location.href = 'camera.html?';
    document.getElementById('cameraSlide').style.display = 'block';
})



