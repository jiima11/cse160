var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;         //use color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);  // use uv debug color
    } else if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); //Use normal
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);   //use texture0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // Use texture1
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // Use texture2
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV); // Use texture3
    } else {
      gl_FragColor = vec4(1,.2,.2,1);             //error, put red
    }
      vec3 lightVector = u_lightPos-vec3(v_VertPos);
      float r = length(lightVector);
      //if (r<1.0) {
      //  gl_FragColor = vec4(1,0,0,1);
      //} else if (r<2.0) {
      //  gl_FragColor = vec4(0,1,0,1); 
      //}
      //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N,L), 0.0);

      vec3 R = reflect(-L,N);

      vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

      float specular = pow(max(dot(E,R), 0.0),64.0) * 0.8;

      vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL *0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.2;
      if (u_lightOn) {
        if (u_whichTexture == -2){
          gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
        } else {
          gl_FragColor = vec4(diffuse+ambient, 1.0);
        }
     }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
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
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVarGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }


  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
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
  if (!image || !image1 || !image2 || !image3) {
    console.log('Failed to create image object');
    return false;
  }

  image.onload = function(){ sendImageToTEXTURE0(image)};
  image.src = 'grass.jpg';
  image1.onload = function() { sendImageToTEXTURE1(image1); };
  image1.src = 'sky.jpg';
  image2.onload = function() { sendImageToTEXTURE2(image2); };
  image2.src = 'tnt.jpg';
  image3.onload = function() { sendImageToTEXTURE3(image3); };
  image3.src = 'diamond.jpg';
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
  gl.uniform1i(u_Sampler2, 2);  // Bind texture to sampler1
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

//Globals related to UI
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_segments = 10;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_globalXAngle = 0;
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
let g_normalOn = false;
let g_lightOn = true;
let g_lightPos = [0,1,-2];

function addActionsForHtmlUI() {
  document.getElementById('lightOn').onclick = function() { g_lightOn = true; };
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; };
  document.getElementById('normalOn').onclick = function() { g_normalOn = true; };
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };
  document.getElementById('angleSlider').addEventListener('mousemove', function() {g_globalXAngle = this.value; renderShapes(); });
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderShapes();}});

  document.addEventListener("click", function (event) {
    if (event.shiftKey) {g_blink=g_blink * -1;}});
}

function main() {
  setupWebGL();
  connectVarGLSL();
  addActionsForHtmlUI();
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
  let lr = -event.movementX * sensitivity;
  let ud = -event.movementY * sensitivity;
  g_camera.lr(lr);
  g_camera.ud(ud);
  renderShapes();
}

function keydown(ev) {
  if (ev.keyCode==68) {
    g_camera.moveRight();
  } else if (ev.keyCode == 65) {
    g_camera.moveLeft();
  } else if (ev.keyCode == 87) {
    g_camera.moveForward();
  } else if (ev.keyCode == 83) {
    g_camera.moveBackwards();
  } else if (ev.keyCode == 81) {
    g_camera.panLeft();
  } else if (ev.keyCode == 69) {
    g_camera.panRight();
  } else if (ev.keyCode == 82) { 
    g_camera.moveUp();
  } else if (ev.keyCode == 70) { 
    g_camera.moveDown();
  }
  renderShapes();
  console.log(ev.keyCode);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
function tick() {
  g_seconds = performance.now()/1000.0-g_startTime;
  updateAnimationAngles();
  renderShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  g_lightPos[0] = Math.cos(g_seconds);
}
let g_camera = new Camera();

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
  nose.textureNum = 3;
  nose.matrix.rotate(0,1,0,0);
  nose.matrix.scale(0.30, .20, .2);
  nose.matrix.translate(-.50, 2.2, -1.50);
  nose.render();

  var leftEar = new Cube();
  leftEar.color = [.52, .52, .52, 1.0];
  leftEar.textureNum = 3;
  leftEar.matrix.rotate(0,1,0,0);
  leftEar.matrix.scale(0.20, .20, .2);
  leftEar.matrix.translate(-2.0, 3.8, .10);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [.52, .52, .52, 1.0];
  rightEar.textureNum = 3;
  rightEar.matrix.rotate(0,1,0,0);
  rightEar.matrix.scale(0.20, .20, .2);
  rightEar.matrix.translate(1.0, 3.8, .10);
  rightEar.render();

  var head = new Cube();
  head.color = [.52, .52, .52, 1.0];
  head.textureNum = 3;
  head.matrix.rotate(0,1,0,0);
  head.matrix.scale(.9, .6, .5);
  head.matrix.translate(-.5, 0.5, -.25);
  head.render();

  var body = new Cube();
  body.color = [.52, .52, .52, 1.0];
  body.textureNum = 3;
  body.matrix.rotate(0,1,0,0);
  body.matrix.scale(.70, .50, .4);
  body.matrix.translate(-.5, -.4, -.18);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [.52, .52, .52, 1.0];
  leftArm.textureNum = 3;
  leftArm.matrix.rotate(-g_leftArm,0,0,1);
  leftArm.matrix.scale(0.5, .18, .2);
  leftArm.matrix.translate(.15, .5, .18);
  leftArm.render();

  var rightArm = new Cube();
  rightArm.color = [.52, .52, .52, 1.0];
  rightArm.textureNum = 3;
  rightArm.matrix.rotate(g_rightArm, 0, 0, 1);
  rightArm.matrix.scale(0.5, .18, .2);
  rightArm.matrix.translate(-1.15, .5, .18);
  rightArm.render();
  
  var leftLeg = new Cube();
  leftLeg.color = [.52, .52, .52, 1.0];
  leftLeg.textureNum = 3;
  leftLeg.matrix.rotate(-g_leftLeg,1,0,0);
  var leftLegCoord = new Matrix4(leftLeg.matrix)
  leftLeg.matrix.scale(0.30, .4, .4);
  leftLeg.matrix.translate(.17, -.8, -.18);
  leftLeg.render();

  var rightLeg = new Cube();
  rightLeg.color = [.52, .52, .52, 1.0];
  rightLeg.textureNum = 3;
  rightLeg.matrix.rotate(-g_rightLeg, 1, 0, 0);
  var rightLegCoord = new Matrix4(rightLeg.matrix)
  rightLeg.matrix.scale(0.30, .4, .4);
  rightLeg.matrix.translate(-1.17, -.8, -.18);
  rightLeg.render();

  var leftStub = new Cube();
  leftStub.matrix = leftLegCoord;
  leftStub.color = [.52, .52, .52, 1.0];
  leftStub.textureNum = 3;
  leftStub.matrix.rotate(-g_leftFeet,1,0,0);
  leftStub.matrix.scale(0.25, .1, .4);
  leftStub.matrix.translate(.30, -4.0, -.18);
  leftStub.render();

  var rightStub = new Cube();
  rightStub.matrix = rightLegCoord;
  rightStub.color = [.52, .52, .52, 1.0];
  rightStub.textureNum = 3;
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
  var globalRotMat = new Matrix4().rotate(g_globalXAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0],g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();

  var sphere = new Sphere();
  sphere.color = [1.0,1.0,1.0,1.0];
  sphere.textureNum=-2;
  if (g_normalOn) sphere.textureNum=-3;
  sphere.matrix.scale(.5,.5,.5);
  sphere.matrix.translate(-.5, .5, 3);
  sphere.render();

  var sky = new Cube();
  sky.color = [0.0,0.0,1.0,1.0];
  sky.textureNum=1;
  if (g_normalOn) sky.textureNum=-3;
  sky.matrix.scale(-7,-7,-7);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  drawAnimal(0,0,0);

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
