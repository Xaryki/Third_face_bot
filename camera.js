document.getElementById('captureButton').addEventListener('click', () => {

    let base64Data = capturePhoto();
  
    const apiUrl = 'http://81.94.159.98:8000/api/v1/send/photo';
    let image = base64Data;
    const postData = {
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

function preload() {
  // Загружаем изображение шляпы
  hatImg = loadImage('hat.png'); // Убедитесь, что указан правильный путь к изображению
  Telegram.WebApp.expand();
  document.getElementById("test").innerHTML = window.Telegram.WebApp.initDataUnsafe.user.id;
}


function setup() {

  canvas = createCanvas(480, 360);
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
  // console.log(detections);

  clear();//Draw transparent background;
  //drawBoxs(detections);//Draw detection box:
  //drawLandmarks(detections);//// Draw all the face points:
  // drawExpressions(detections, 20, 250, 14);//Draw face expression:

  // Вставьте вызов функции здесь
  drawHat(detections);

  faceapi.detect(gotFaces);// Call the function again at here:
}

function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected:
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
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

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected:
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    fill(44, 169, 225);

    text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
    text("happiness: " + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    text("anger:        " + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    text("disgusted: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    text("fear:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
  }else{//If no faces is detected:
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("anger: ", x, y + textYSpace*2);
    text("sad: ", x, y + textYSpace*3);
    text("disgusted: ", x, y + textYSpace*4);
    text("surprised: ", x, y + textYSpace*5);
    text("fear: ", x, y + textYSpace*6);
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




function capturePhoto() {
    const videoElement = document.getElementById('video');
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Конвертация в Base64 
    const base64Image = canvas.toDataURL('image/png');

    // Удаление префикса Base64
    const base64Data = base64Image.split(',')[1];

    return base64Data;
}






