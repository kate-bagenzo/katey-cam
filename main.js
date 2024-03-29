import './style.css'
import dither from 'canvas-dither'

//variables
let width = 512;
if (window.screen.width < 512) {
  width = 256;
}
const height = width / (4 / 3);
const frameRate = 2;
let video = null;
let canvas = null;
let image = null;
let streaming = true;
let colorOn = false;
let imageFlipped = false;
let timerOn = false;
let timerVisualOn = false;
let timerVisualClock = "🕒";
let ignorePicture = false;
let ditherType = "floydsteinberg";
let bayerThreshold = 100;

//setup controls
//dither types
const ditherOptions = document.getElementsByName('dithertype');
const bayerOptionThreshold = document.getElementById('bayerthreshold');
for (let i = 0; i < ditherOptions.length; i++) {
  if (ditherOptions[i].value == "floydsteinberg") {
    ditherOptions[i].checked = true;
  }
  if (ditherOptions[i].value == "bayer") {
    ditherOptions[i].addEventListener('change', function () {
      bayerOptionThreshold.innerHTML = `
      <input type="range" min="1" max="255" id="bayerrange" value=` + bayerThreshold + `>
      <h3>threshold</h3>
      `;
      const bayerThresholdSlider = document.getElementById('bayerrange');
      bayerThresholdSlider.addEventListener('input', function () {
        bayerThreshold = this.value;
      })
      console.log("bayeron");
    })
  } else {
    ditherOptions[i].addEventListener('change', function () {
      bayerOptionThreshold.innerHTML = "";
      console.log("bayeroff");
    })
  }
  ditherOptions[i].addEventListener('click', function () {
    ditherType = this.value;
  })
}

//controls
//image flip
const flipped = document.getElementById('flipped');
flipped.checked = false;
flipped.addEventListener('change', function () {
  imageFlipped = !imageFlipped;
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
})

//controls
//image color
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
color1.checked = true;
const colorDiv = document.getElementById('customcolor');
color1.addEventListener('change', function () {
  colorDiv.innerHTML = "";
  colorOn = false;
})
color2.addEventListener('change', function () {
  colorDiv.innerHTML = `
  <input type="color" id="colorselector" name="colorselector" value ="#cc0000">
  `;
  colorOn = true;
  ctx.fillStyle = "#cc0000";
  const colorSelector = document.getElementById('colorselector');
  colorSelector.addEventListener('change', function () {
    ctx.fillStyle = colorSelector.value;
  })
})


//video
//get the webcam
video = document.querySelector('video');
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    video.srcObject = stream;
    video.play;
  })
  .catch((err) => {
    console.error('could not get webcam');
  });

video.setAttribute("width", width);
video.setAttribute("height", height);

//setup canvas
canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;

//click for photo
const threeSec = document.getElementById('3sec');
threeSec.checked = false;
threeSec.addEventListener('change', function () {
  timerOn = !timerOn;
})
canvas.addEventListener('click', function () {
  if (ignorePicture) {
    return;
  }
  if (timerOn && streaming) {
    ignorePicture = true;
    timerVisualOn = true;
    setTimeout(function () { takePhotoTimed() }, 3000);
  } else {
    takePhoto();
  }
});

//photo instructions
const instructions = document.getElementById('instructions');
function takePhoto() {
  streaming = !streaming;
  if (streaming) {
    instructions.innerHTML = "click image to take photo"
  } else {
    const dataUrl = canvas.toDataURL("png");
    instructions.innerHTML = "<a href=" + dataUrl + " target=\"_blank\">click here to save photo</a>"
  }
  loop();
}

//timer
function takePhotoTimed() {
  takePhoto();
  ignorePicture = false;
  timerVisualOn = false;
}

//more canvas setup
const ctx = canvas.getContext('2d');
ctx.font = "30px Inter";
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

video.addEventListener('play', function () {
  ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
}, false);



//draw video to canvas
function loop() {
  if (streaming) {
    requestAnimationFrame(loop);
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  switch (ditherType) {
    case 'atkinson':
      image = dither.atkinson(image);
      break;
    case 'bayer':
      image = dither.bayer(image, bayerThreshold);
      break;
    case 'floydsteinberg':
      image = dither.floydsteinberg(image);
      break;
  }
  ctx.putImageData(image, 0, 0);
  if (colorOn) {
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }
  if (timerVisualOn) {

  }
  if (timerVisualOn) {
    ctx.fillText(timerVisualClock, 30, 50);

  }
}
loop();