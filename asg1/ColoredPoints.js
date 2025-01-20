// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  //gl_PointSize = 10.0;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' + 
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }  
}

function connectVariablesToGLSL(){
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
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5
let g_selectedType = POINT;

let g_segments = 10;

function addActionsForHtmlUI(){
  // document.getElementById('green').onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  // document.getElementById('red').onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('clearButton').onclick = function() {
    g_shapesList = [];
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  }
  document.getElementById('triButton').onclick = function() {
    g_selectedType = TRIANGLE;
  }
  document.getElementById('circleButton').onclick = function() {
    g_selectedType = CIRCLE;
  }

  document.getElementById('redSlide').value = g_selectedColor[0] * 100;
  document.getElementById('greenSlide').value = g_selectedColor[1] * 100;
  document.getElementById('blueSlide').value = g_selectedColor[2] * 100;
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value});
  document.getElementById('segments').addEventListener('mouseup', function() {g_segments = this.value});

  document.getElementById("drawingButton").onclick = function() {drawThis();}


}

function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if (ev.buttons == 1) {
        click(ev);
    }
};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {

  let [x,y] = convertCoordinatesEventToGl(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}

function convertCoordinatesEventToGl(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function renderAllShapes(){
    var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_points.length;
    var len = g_shapesList.length;
    for (let i = 0; i < g_shapesList.length; i++) {
      g_shapesList[i].render();
  }
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
  }

  function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm){
      console.log("Failed to get " + htmlID + " from HTML");
      return;
    }
    htmlElm.innerHTML = text;
  }

let g_drawing = 0;
function drawThis() {
  g_drawing = 1;
  gl.uniform4f(u_FragColor, 0, 0.7, 1, 1); // light blue
  drawTriangle([0, 0, 0.3, 0, 0.3, 0.3]);
  drawTriangle([0.3, 0, 0.3, 0.3, 0.5, 0.3]);
  gl.uniform4f(u_FragColor, 1, 1, 1, 1); // white
  drawTriangle([0, 0, 0, 0.5, 0.3, 0.3]);
  gl.uniform4f(u_FragColor, 0, 0.7, 1, 1); // light blue
  drawTriangle([0, 0.5, 0.3, 0.3, 0.4, 0.5]);
  drawTriangle([0.3, 0.3, 0.4, 0.5, 0.5, 0.3]);
  drawTriangle([-0.2, 0.3, 0, 0.5, -0.3, 0.5]);
  drawTriangle([0, 0, 0, 0.5, -0.2, 0.3]);
  drawTriangle([-0.2, 0.3, -0.3, 0.5, -0.4, 0.3]);
  drawTriangle([-0.4, 0.3, -0.5, 0.5, -0.3, 0.5]);
  drawTriangle([-0.4, 0.3, -0.6, 0.3, -0.5, 0.5]);
  gl.uniform4f(u_FragColor, 1, 1, 1, 1); // white
  drawTriangle([-0.2, 0.3, -0.3, 0.2, -0.4, 0.3]);
  drawTriangle([-0.4, 0.3, -0.5, 0.2  , -0.6, 0.3]);
  gl.uniform4f(u_FragColor, 0, 0.7, 1, 1); // light blue
  drawTriangle([0.3, 0.5, 0.2, 0.6, 0.4, 0.6]);
  drawTriangle([0, 0, 0.5, 0, 0.5, -0.3]);
  drawTriangle([0, 0, 0, -0.3, 0.5, -0.3]);
  drawTriangle([0.3, 0, 0.5, 0, 0.5, 0.3]);
  drawTriangle([0, -0.3, 0.5, -0.3, 0.5, -0.6]);
  drawTriangle([0, -0.6, 0, 0, 0.5, -0.6]);
  gl.uniform4f(u_FragColor, 1, 1, 1, 1); // white
  drawTriangle([0, 0, 0, -0.3, -0.2, -0.3]);
  drawTriangle([0, -0.3, -0.6, -0.3, -0.6, -0.6]);
  drawTriangle([0, -0.6, 0.0, -0.3, -0.6, -0.6]);
  drawTriangle([-0.3, -0.3, -0.4, -0.3, -0.4, -0.2]);
  drawTriangle([-0.5, -0.3, -0.5, -0.2, -0.6, -0.3]);
}

