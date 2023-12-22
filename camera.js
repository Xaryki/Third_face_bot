document.getElementById('captureButton').addEventListener('click', () => {
    const videoElement = document.getElementById('video');
  
    let base64Data = capturePhoto();
    //capturePhoto2();
    let base64String1 = capturePhoto(); // Ваш первый Base64 файл
    let base64String2 = capturePhoto2(); // Ваш второй Base64 файл
    //console.log(base64String1);
    //console.log(base64String2);
    // Преобразование в Uint8Array
    let uint8Array1 = base64ToUint8Array(base64String1);
    let uint8Array2 = base64ToUint8Array(base64String2);
  
    console.log(mergeImages(uint8Array1, uint8Array2, videoElement.width, videoElement.height));
  
    //console.log(mergedBase64Image);
    const apiUrl = 'https://borisenko-ivan.online:443/api/v1/send/photo';
    let image = base64Data;
    const postData = {
     uuid: 1277274408,
    //uuid: window.Telegram.WebApp.initDataUnsafe.user.id,
    image: base64Data,
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


function mergeImages(array1, array2, width, height) {
    let result = new Uint8Array(array1.length);

    for (var i = 0; i < width * height * 3; i += 3) {
        if (array2[i] === 255 && array2[i + 1] === 255 && array2[i + 2] === 255) {
            result[i] = array1[i];
            result[i + 1] = array1[i + 1];
            result[i + 2] = array1[i + 2];
        } else {
            result[i] = Math.min(array1[i] + array2[i], 255);
            result[i + 1] = Math.min(array1[i + 1] + array2[i + 1], 255);
            result[i + 2] = Math.min(array1[i + 2] + array2[i + 2], 255);
        }
    }

    return uint8ArrayToBase64(result);
}



function cleanBase64String(base64) {
    // Удаление пробельных символов
    return base64.trim();
}
function cleanBase64String2(base64) {
    return base64.replace(/\s/g, '');
}
function base64ToUint8Array(base64) {
    base64 = cleanBase64String(base64); // Очистка строки от пробельных символов
    try {
        var raw = atob(base64);
    } catch (e) {
        console.error("Ошибка декодирования Base64: ", e);
        return null;
    }
    var uint8Array = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}
function concatenateUint8Arrays(array1, array2) {
    var result = new Uint8Array(array1.length + array2.length);
    result.set(array1, 0);
    result.set(array2, array1.length);
    return result;
}

function uint8ArrayToBase64(uint8Array) {
    var binaryString = '';
    for (var i = 0; i < uint8Array.byteLength; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}

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

  canvas = createCanvas(windowWidth, windowHeight);
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
  drawLandmarks(detections);//// Draw all the face points:

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








