var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;

let u_whichTexture;

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function initTextures() {
  var image = new Image();
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();
  var image4 = new Image();
  var image5 = new Image();



  if (!image || !image1 || !image2 || !image3 || !image4 || !image5) {
    console.log('Failed to create image object');
    return false;
  }

  image.onload = function(){ sendImageToTEXTURE0(image)};
  image.src = 'sky.jpg';
  image1.onload = function() { sendImageToTEXTURE1(image1); };
  image1.src = 'grass.jpg';
  image2.onload = function() { sendImageToTEXTURE2(image2); };
  image2.src = 'mossy.jpg';
  image3.onload = function() { sendImageToTEXTURE3(image3); };
  image3.src = 'water.jpg';
  image4.onload = function() { sendImageToTEXTURE4(image4); };
  image4.src = 'tnt.jpg';
  image5.onload = function() { sendImageToTEXTURE5(image5); };
  image5.src = 'diamond.jpg';
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture')
}

function sendImageToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);  // Bind texture to sampler1
}

function sendImageToTEXTURE2(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler2, 2); 
}

function sendImageToTEXTURE3(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler3, 3); 
}

function sendImageToTEXTURE4(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler4, 4); 
}

function sendImageToTEXTURE5(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object.');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler5, 5); 
}

function conversion(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return [x,y];
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//global variables
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_segments = 10;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_globalAnglex = 0;
let g_leftArm = 0;
let g_rightArm = 0;
let g_leftLeg = 0;
let g_leftFeet = 0;
let g_rightLeg = 0;
let g_rightFeet = 0;
let g_animationLeftHand = false;
let g_animationRightHand = false;
let g_animationLeftLeg = false;
let g_animationRightLeg = false;
let g_animateAll = false;

function addActionsForHtmlUI() {

    
    document.getElementById('leftArm').addEventListener('mousemove',   function() {g_leftArm = this.value; renderShapes();});
    document.getElementById('rightArm').addEventListener('mousemove',   function() {g_rightArm = this.value; renderShapes();});
    document.getElementById('leftLeg').addEventListener('mousemove',   function() {g_leftLeg = this.value; renderShapes();});
    document.getElementById('leftFeet').addEventListener('mousemove',   function() {g_leftFeet = this.value; renderShapes();});
    document.getElementById('rightLeg').addEventListener('mousemove',   function() {g_rightLeg = this.value; renderShapes();});
    document.getElementById('rightFeet').addEventListener('mousemove',   function() {g_rightFeet = this.value; renderShapes();});

    //left arm animation on/off
    document.getElementById('animationOnButton1').onclick = function() {g_animationLeftHand = true;};
    document.getElementById('animationOffButton1').onclick = function() {g_animationLeftHand = false;};

    //right arm animation on/off
    document.getElementById('animationOnButton2').onclick = function() {g_animationRightHand = true;};
    document.getElementById('animationOffButton2').onclick = function() {g_animationRightHand = false;};

    //left leg animation on/off
    document.getElementById('animationOnButton3').onclick = function() {g_animationLeftLeg = true;};
    document.getElementById('animationOffButton3').onclick = function() {g_animationLeftLeg = false;};

    //right leg animation on/off
    document.getElementById('animationOnButton4').onclick = function() {g_animationRightLeg = true;};
    document.getElementById('animationOffButton4').onclick = function() {g_animationRightLeg = false;};

    //animate everything on/off
    document.getElementById('animationOnButton5').onclick = function() {g_animateAll = true;};
    document.getElementById('animationOffButton5').onclick = function() {g_animateAll = false;};

    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAnglex = this.value; renderShapes(); });
}

function main() {
  setupWebGL();
  connectVariablesGLSL();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = () => canvas.requestPointerLock();
  document.addEventListener("mousemove", mouseLook, false);

  document.onkeydown = keydown;
  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  requestAnimationFrame(tick);
}

var g_shapesList = [];

function mouseLook(event) {
  if (document.pointerLockElement !== canvas) return;
  const sensitivity = 0.005;
  let lr = -event.movementX * sensitivity; // Left/right rotation
  let ud = -event.movementY * sensitivity; // Up/down rotation
  g_camera.lr(lr);
  g_camera.ud(ud);
  renderShapes();
}

function keydown(ev) {
  if (ev.keyCode==68) { //D
    g_camera.moveRight();
  } else if (ev.keyCode == 65) { //A
    g_camera.moveLeft();
  } else if (ev.keyCode == 87) { //W
    g_camera.moveForward();
  } else if (ev.keyCode == 83) { //S
    g_camera.moveBackwards();
  } else if (ev.keyCode == 81) { //Q
    g_camera.panLeft();
  } else if (ev.keyCode == 69) { //E
    g_camera.panRight();
  }
  renderShapes();
  console.log(ev.keyCode);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  renderShapes();
  requestAnimationFrame(tick);
}

let g_camera = new Camera();

let g_map = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, -3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 2],
  [2, -3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 2, -2, -2, -2, 2],
  [2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1, -1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -4, -4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -4, -4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, -2, -2, -2, -2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2],
  [2, -1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, -1, 2],
  [2, -1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, -1, -1, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];


function drawMap() {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      let height = g_map[x][y];
      if (height > 0 && height < 4) {
        for (let h = 0; h < height; h++) {
          var wall = new Cube();
          wall.color = [0, 1, 1, 1];
          wall.textureNum = 2;
          wall.matrix.translate(x - 16, h - 0.75, y - 16);
          wall.renderFaster();
        }
      } else if (height == -1) {
        var wall = new Cube();
        wall.color = [0, 1, 1, 1];
        wall.textureNum = 4;
        wall.matrix.translate(x - 16, -.75, y - 16);
        wall.renderFaster();
      } else if (height == -2) {
        var wall = new Cube();
        wall.color = [0, 0, 1, 1];
        wall.textureNum = 3;
        wall.matrix.translate(x - 16, -1.7, y - 16);
        wall.renderFaster();
      } else if (height == -3) {
        var wall = new Cube();
        wall.color = [0, 1, 1, 1];
        wall.textureNum = 5;
        wall.matrix.translate(x - 16, -.75, y - 16);
        wall.renderFaster();
      } else if (height == -4) {
        var wall = new Cube();
        wall.color = [0, 1, 1, 1];
        wall.textureNum = 5;
        wall.matrix.translate(x - 16, -1.40, y - 16);
        wall.renderFaster();
      }
    }
  }
}

function drawAnimal() {
  var leftEye3 = new Cube();
  leftEye3.color = [1.0, 1.0, 1.0, 1.0];
  leftEye3.textureNum = -2;
  leftEye3.matrix.rotate(0,1,0,0);
  leftEye3.matrix.scale(0.10, 0.05, .1);
  leftEye3.matrix.translate(2.0, 13, -1.50);
  leftEye3.render();

  var rightEye3 = new Cube();
  rightEye3.color = [1.0, 1.0, 1.0, 1.0];
  rightEye3.textureNum = -2;
  rightEye3.matrix.rotate(0,1,0,0);
  rightEye3.matrix.scale(0.10, 0.05, .1);
  rightEye3.matrix.translate(-3, 13, -1.50);
  rightEye3.render();

  var belly = new Cube();
  belly.color = [1.0, 1.0, 1.0, 1.0];
  belly.textureNum = -2;
  belly.matrix.rotate(0,1,0,0);
  belly.matrix.scale(0.30, .30, .1);
  belly.matrix.translate(-.50, -.3, -1.50);
  belly.render();

  var honker = new Cube();
  honker.color = [1.0, 1.0, 1.0, 1.0];
  honker.textureNum = -2;
  honker.matrix.rotate(0,1,0,0);
  honker.matrix.scale(0.10, .10, .23);
  honker.matrix.translate(-.50, 5.5, -1.50);
  honker.render();

  var nose = new Cube();
  nose.color = [1.0, 1.0, 1.0, 1.0];
  nose.textureNum = 5;
  nose.matrix.rotate(0,1,0,0);
  nose.matrix.scale(0.30, .20, .2);
  nose.matrix.translate(-.50, 2.2, -1.50);
  nose.render();

  var leftEar = new Cube();
  leftEar.color = [.52, .52, .52, 1.0];
  leftEar.textureNum = 5;
  leftEar.matrix.rotate(0,1,0,0);
  leftEar.matrix.scale(0.20, .20, .2);
  leftEar.matrix.translate(-2.0, 3.8, .10);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [.52, .52, .52, 1.0];
  rightEar.textureNum = 5;
  rightEar.matrix.rotate(0,1,0,0);
  rightEar.matrix.scale(0.20, .20, .2);
  rightEar.matrix.translate(1.0, 3.8, .10);
  rightEar.render();

  var head = new Cube();
  head.color = [.52, .52, .52, 1.0];
  head.textureNum = 5;
  head.matrix.rotate(0,1,0,0);
  head.matrix.scale(.9, .6, .5);
  head.matrix.translate(-.5, 0.5, -.25);
  head.render();

  var body = new Cube();
  body.color = [.52, .52, .52, 1.0];
  body.textureNum = 5;
  body.matrix.rotate(0,1,0,0);
  body.matrix.scale(.70, .50, .4);
  body.matrix.translate(-.5, -.4, -.18);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [.52, .52, .52, 1.0];
  leftArm.textureNum = 5;
  leftArm.matrix.rotate(-g_leftArm,0,0,1);
  leftArm.matrix.scale(0.5, .18, .2);
  leftArm.matrix.translate(.15, .5, .18);
  leftArm.render();

  var rightArm = new Cube();
  rightArm.color = [.52, .52, .52, 1.0];
  rightArm.textureNum = 5;
  rightArm.matrix.rotate(g_rightArm, 0, 0, 1);
  rightArm.matrix.scale(0.5, .18, .2);
  rightArm.matrix.translate(-1.15, .5, .18);
  rightArm.render();
  
  var leftLeg = new Cube();
  leftLeg.color = [.52, .52, .52, 1.0];
  leftLeg.textureNum = 5;
  leftLeg.matrix.rotate(-g_leftLeg,1,0,0);
  var leftLegCoord = new Matrix4(leftLeg.matrix)
  leftLeg.matrix.scale(0.30, .4, .4);
  leftLeg.matrix.translate(.17, -.8, -.18);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = [.52, .52, .52, 1.0];
  rightLeg.textureNum = 5;
  rightLeg.matrix.rotate(-g_rightLeg, 1, 0, 0);
  var rightLegCoord = new Matrix4(rightLeg.matrix)
  rightLeg.matrix.scale(0.30, .4, .4);
  rightLeg.matrix.translate(-1.17, -.8, -.18);
  rightLeg.render();

  var leftStub = new Cube();
  leftStub.matrix = leftLegCoord;
  leftStub.color = [.52, .52, .52, 1.0];
  leftStub.textureNum = 5;
  leftStub.matrix.rotate(-g_leftFeet,1,0,0);
  leftStub.matrix.scale(0.25, .1, .4);
  leftStub.matrix.translate(.30, -4.0, -.18);
  leftStub.render();

  var rightStub = new Cube();
  rightStub.matrix = rightLegCoord;
  rightStub.color = [.52, .52, .52, 1.0];
  rightStub.textureNum = 5;
  rightStub.matrix.rotate(-g_rightFeet,1,0,0);
  rightStub.matrix.scale(0.25, .1, .4);
  rightStub.matrix.translate(-1.30, -4.0, -.18);
  rightStub.render();
}

function renderShapes() {
  var startTime = performance.now();
  // Clear <canvas>
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAnglex, 0, 1, 0);
  globalRotMat = globalRotMat.rotate(g_globalAngle,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //floor
  var floor = new Cube();
  floor.color = [0.0,0.7,0.3,1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0,-.75,0.0);
  floor.matrix.scale(32,0,32);
  floor.matrix.translate(-.5,0,-0.5);
  floor.renderFaster();

  //sky
  var sky = new Cube();
  sky.color = [0.0,0.0,1.0,1.0];
  sky.textureNum = 0;
  sky.matrix.scale(100,100,100);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.renderFaster();

  drawMap();
  drawAnimal();
  
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
