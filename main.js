import './style.css'
import dither from 'canvas-dither'

//variables
const width = 512;
const height = width / (4 / 3);
const frameRate = 2;
let video = null;
let canvas = null;
let image = null;
let streaming = true;
let colorOn = false;
let ditherType = "floydsteinberg";
let bayerThreshold = 100;

//setup controls
//dither types
const ditherOptions = document.getElementsByName('dithertype');
const bayerOptionThreshold = document.getElementById('bayerthreshold');
for (let i = 0; i < ditherOptions.length; i++) {
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
flipped.addEventListener('change', function () {
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
})

//controls
//image color
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
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
canvas.addEventListener('click', function () {
  streaming = !streaming;
  loop();
})

const ctx = canvas.getContext('2d');
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
}

ctx.fillStyle = "white";
loop();