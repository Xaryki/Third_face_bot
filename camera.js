window.onload = function() {
  resizeCanvas(document.getElementById('сanvas'), document.getElementById('video'));
};

function resizeCanvas(canvas, videoElement) {
  let videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
  let windowAspectRatio = window.innerWidth / window.innerHeight;

  if (windowAspectRatio < videoAspectRatio) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / videoAspectRatio;
  } else {
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * videoAspectRatio;
  }

  canvas.style.width = '100%';
  canvas.style.height = '100%';
}

document.getElementById('captureButton').addEventListener('click', () => {

    //let base64Data = capturePhoto();
    //let base64Data2 = capturePhoto2();

    //takeScreenshotAndSend();

    const apiUrl = 'https://borisenko-ivan.online:443/api/v1/send/photo';
    const postData = {
    //uuid: 1277274408,
    uuid: window.Telegram.WebApp.initDataUnsafe.user.id,
    image: takeScreenshotAndSend(),
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

  styleNumber = localStorage.getItem('selectedStyle');

  hatImg = loadImage('hat2.png'); // Путь к изображению для стиля 2

  Telegram.WebApp.expand();

}


function setup() {

  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(480, 360);

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
  drawLandmarks(detections);//// Draw all the face points:

  drawHat(detections);

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
    let hatWidth = _width * 3;
    let hatHeight = hatWidth * 0.6; // Примерное соотношение ширины к высоте
    let hatX = _x - hatWidth * 0.35;
    let hatY = _y - hatHeight * 0.5; // Смещение шляпы вверх от головы

    // Отрисовка шляпы
    image(hatImg, hatX, hatY, hatWidth, hatHeight);
  }
}

function drawHat2(detections){
  for (let i = 0; i < detections.length; i++) {
    let {_x, _y, _width, _height} = detections[i].alignedRect._box;

    // Расчет размера и позиции шляпы
    let hatWidth = _width * 3.2;
    let hatHeight = hatWidth * 0.8; // Примерное соотношение ширины к высоте
    let hatX = _x - hatWidth * 0.35;
    let hatY = _y - hatHeight * 0.5; // Смещение шляпы вверх от головы

    // Отрисовка шляпы
    image(hatImg, hatX, hatY, hatWidth, hatHeight);
  }
}
function capturePhoto() {
    const videoElement = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth , videoElement.videoHeight);
    //ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    // Конвертация в Base64
    const base64Image = canvas.toDataURL('image/png', 1);

    // Удаление префикса Base64
    const base64Data = base64Image.split(',')[1];
    //console.log(base64Image);
    return base64Data;
}


function capturePhoto2() {
  // Предполагаем, что у вашего элемента canvas есть id "canvas"
  let canvasElement = document.getElementById('canvas');

  if (canvasElement) {
    // Преобразуем содержимое канваса в строку Base64
    let base64Image = canvasElement.toDataURL('image/png', 1);
    // Удаление префикса Base64
    const base64Data = base64Image.split(',')[1];
    // Выводим строку Base64 в консоль
    //console.log(base64Data);
    return base64Data;
  } else {
    console.log('Канвас не найден');
  }

}


function takeScreenshotAndSend() {
    let videoElement = document.getElementById('video');
    let canvasElement = document.getElementById('canvas');


    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0,0, 480, 360)


    ctx.drawImage(videoElement, 0, 0, 480, 360);
    drawHat2(detections);

    console.log(canvasElement.toDataURL('image/png'));
    return canvasElement.toDataURL('image/png').split(',')[1];
}




