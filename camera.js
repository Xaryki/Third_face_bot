document.getElementById('captureButton').addEventListener('click', () => {

    let base64Data = capturePhoto();
    const apiUrl = 'https://borisenko-ivan.online:443/api/v1/send/photo';
    let image = base64Data;
    const postData = {
    // uuid: 1277274408,
    uuid: window.Telegram.WebApp.initDataUnsafe.user.id,
    image: image,
    };

    // Создаем объект XMLHttpRequest
    const xhr = new XMLHttpRequest();
  
    // Устанавливаем метод запроса и URL
    xhr.open('POST', apiUrl, true);
  
    // Устанавливаем заголовок Content-Type
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    // Обработчик события готовности запроса
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        // Проверяем статус ответа
        if (xhr.status === 200) {
        console.log('Успешный ответ от сервера:', xhr.responseText);
        } else {
        console.error('Ошибка при отправке запроса. Статус:', xhr.status);
        }
    }
    };
  
    // Преобразуем объект postData в JSON и отправляем в теле запроса
    const postDataJSON = JSON.stringify(postData);
    xhr.send(postDataJSON);
});



let faceapi;
let detections = [];

let video;
let canvas;
let hatImg; // Переменная для изображения шляпы
let styleNumber ;

function preload() {
  // Загружаем изображение шляпы
  // Загружаем разные изображения в зависимости от стиля
  styleNumber = localStorage.getItem('selectedStyle');
  if (styleNumber === '1') {
    hatImg = loadImage('hat.png'); // Путь к изображению для стиля 1
  } else if (styleNumber === '2') {
    hatImg = loadImage('hat2.png'); // Путь к изображению для стиля 2
  }
  // hatImg = loadImage('hat.png'); // Убедитесь, что указан правильный путь к изображению
  Telegram.WebApp.expand();
  
}


function setup() {

  canvas = createCanvas(1024, 1024);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  //Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces
}


// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections

  clear();//Draw transparent background;
  //drawLandmarks(detections);//// Draw all the face points:

  // Вставьте вызов функции здесь
    if (styleNumber === '1') {
   drawHat(detections); 
  } else if (styleNumber === '2') {
    drawHat2(detections); // 
  }
  

  faceapi.detect(gotFaces);// Call the function again at here:
}


function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected:
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}




function drawHat(detections){
  for (let i = 0; i < detections.length; i++) {
    let {_x, _y, _width, _height} = detections[i].alignedRect._box;

    // Расчет размера и позиции шляпы
    let hatWidth = _width * 1.5;
    let hatHeight = hatWidth * 1; // Примерное соотношение ширины к высоте
    let hatX = _x - hatWidth * 0.3;
    let hatY = _y - hatHeight * 0.4; // Смещение шляпы вверх от головы

    // Отрисовка шляпы
    image(hatImg, hatX, hatY, hatWidth, hatHeight);
  }
}

function drawHat2(detections){
  for (let i = 0; i < detections.length; i++) {
    let {_x, _y, _width, _height} = detections[i].alignedRect._box;

    // Расчет размера и позиции шляпы
    let hatWidth = _width * 3;
    let hatHeight = hatWidth * 0.6; // Примерное соотношение ширины к высоте
    let hatX = _x - hatWidth * 0.35;
    let hatY = _y - hatHeight * 0.5; // Смещение шляпы вверх от головы

    // Отрисовка шляпы
    image(hatImg, hatX, hatY, hatWidth, hatHeight);
  }
}



function capturePhoto() {
    const videoElement = document.getElementById('video');
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    // Конвертация в Base64 
    const base64Image = canvas.toDataURL('image/png');

    // Удаление префикса Base64
    const base64Data = base64Image.split(',')[1];

    return base64Data;
}






