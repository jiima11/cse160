class Triangle{
    constructor(){
        this.type='triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      // Pass size of point
      gl.uniform1f(u_Size, size);
      // Draw
      //gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size/200.0;
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
    }
}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES,0,n);
}

var g_vertexBuffer=null;

function initTriangle3D(vertices) {
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // Ensure buffer data size

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);  // The stride is 0, meaning each vertex has 3 components, no extra space between them
  gl.enableVertexAttribArray(a_Position);  // Enable attribute array for a_Position
}

function drawTriangle3D(vertices) {
  var n = vertices.length / 3; // The number of vertices, assuming 3 floats per vertex
  initTriangle3D(vertices);  // Initialize buffer with vertices data

  // Draw the triangles (12 triangles = 36 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length / 3;
  initTriangle3D(vertices);

  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, n);
  
  g_vertexBuffer = null;
}
