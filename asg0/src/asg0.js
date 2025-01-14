// Isaac Ma
// jiima@ucsc.edu

//Notes to Grader: 



// DrawRectangle.js
function main() {
  // Retrieve <canvas> element                                  <- (1)
   var canvas = document.getElementById('example');
   if (!canvas) {
     console.log('Failed to retrieve the <canvas> element');
     return;
   }

  // Get the rendering context for 2DCG                          <- (2)
  var ctx = canvas.getContext('2d');
  // Draw a blue rectangle                                       <- (3)
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
}

function drawVector(v, color) {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + (v.elements[0] * 20), cy - (v.elements[1] * 20));
  ctx.stroke();
}

function angleBetween(v1, v2, d) {
  let bottom = v1.magnitude() * v2.magnitude();
  let new_bottom = ((Math.acos((d/bottom)) * (180/Math.PI)).toFixed());
  return new_bottom;
}

function handleDrawEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let vector1_x = parseFloat(document.getElementById("v1_x").value);
  let vector1_y = parseFloat(document.getElementById("v1_y").value);
  let vector2_x = parseFloat(document.getElementById("v2_x").value);
  let vector2_y = parseFloat(document.getElementById("v2_y").value);

  let vector_1 = new Vector3([vector1_x, vector1_y, 0]);
  let vector_2 = new Vector3([vector2_x, vector2_y, 0]);

  drawVector(vector_1, "red");
  drawVector(vector_2, "blue");
}

function handleDrawOperationEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  let vector1_x = parseFloat(document.getElementById("v1_x").value);
  let vector1_y = parseFloat(document.getElementById("v1_y").value);
  let vector2_x = parseFloat(document.getElementById("v2_x").value);
  let vector2_y = parseFloat(document.getElementById("v2_y").value);

  let vector_1 = new Vector3([vector1_x, vector1_y, 0]);
  let vector_2 = new Vector3([vector2_x, vector2_y, 0]);
  drawVector(vector_1, "red");
  drawVector(vector_2, "blue");
  let vector_3 = vector_1;
  let vector_4 = vector_2;

  let user_option = document.getElementById("operations-select").value;
  let scalar_option = parseFloat(document.getElementById("scale").value);

  switch(user_option) {
    case "add":
      vector_3.add(vector_2);
      console.log(vector_3);
      console.log("vector 3 element 0: " + vector_3.elements[0]);
      console.log("vector 3 element 1: " + vector_3.elements[1]);
  
      drawVector(vector_3, "green");
      break;

    case "sub":
      vector_3.sub(vector_2);
      console.log(vector_3);
      console.log("vector 3 element 0: " + vector_3.elements[0]);
      console.log("vector 3 element 1: " + vector_3.elements[1]);
  
      drawVector(vector_3, "green");
      break;

    case "mul":
      vector_3.mul(scalar_option);
      vector_4.mul(scalar_option);
      console.log(vector_3);
      console.log(vector_4);
  
      drawVector(vector_3, "green");
      drawVector(vector_4, "green");
      break;

    case "div":
      vector_3.div(scalar_option);
      vector_4.div(scalar_option);
      console.log(vector_3);
      console.log(vector_4);
  
      drawVector(vector_3, "green");
      drawVector(vector_4, "green");
      break;

    case "mag":
      console.log("Magnitude v1: " + vector_3.magnitude());
      console.log("Magnitude v2: " + vector_4.magnitude());
      break;

    case "norm":
      vector_3.normalize();
      vector_4.normalize();
      console.log(vector_3);
      console.log(vector_4);
  
      drawVector(vector_3, "green");
      drawVector(vector_4, "green");
      break;

    case "ang_bet":
      let d = Vector3.dot(vector_1, vector_2);
      let angle = angleBetween(vector_1, vector_2, d);
      console.log("Angle: " + angle);
      break;       

    case "area":
      let area_answer = Vector3.cross(vector_1, vector_2);
      let final_area = ((area_answer.magnitude())/2)
      console.log("Area of the triangle: " + final_area);
      break;       
  }

}
