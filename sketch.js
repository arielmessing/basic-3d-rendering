let points = [];
let angleX = 0; // Separate angles for better control
let angleY = 0;

function setup() {
  createCanvas(600, 400);

  // Initialize cube vertices
  points[0] = createVector(-0.5, -0.5, -0.5); 
  points[1] = createVector(0.5, -0.5, -0.5);
  points[2] = createVector(0.5, 0.5, -0.5);
  points[3] = createVector(-0.5, 0.5, -0.5);
  points[4] = createVector(-0.5, -0.5, 0.5); 
  points[5] = createVector(0.5, -0.5, 0.5);
  points[6] = createVector(0.5, 0.5, 0.5);
  points[7] = createVector(-0.5, 0.5, 0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#fafaf9');
  translate(width / 2, height / 2);

  angleY += 0.01;
  angleX += 0.005;  

  // Define rotation matrices using our new angles
  let rotationX = [
    [1, 0, 0],
    [0, cos(angleX), -sin(angleX)],
    [0, sin(angleX), cos(angleX)],
  ];

  let rotationY = [
    [cos(angleY), 0, -sin(angleY)],
    [0, 1, 0],
    [sin(angleY), 0, cos(angleY)]
  ];

  let points1 = [];
  
  for (let p of points) {
    let matrix = vector2Matrix(p);
    
    // Apply rotations
    let rotated = matmul(rotationX, matrix);
    rotated = matmul(rotationY, rotated);

    // Perspective Projection Calculation
    let distance = 2;
    let z = 1 / (distance - rotated[2][0]);

    let projection = [
      [z, 0, 0], 
      [0, z, 0]
    ];

    let projected2d = matmul(projection, rotated);
    let p1 = matrix2Vector(projected2d);
    p1.mult(200);
    points1.push(p1);
  }

  // Drawing the cube edges
  stroke('#1a1a1a');
  strokeWeight(1.5);
  noFill();
  for (let i = 0; i < 4; i++) {
    // Draw squares
    line(points1[i].x, points1[i].y, points1[(i + 1) % 4].x, points1[(i + 1) % 4].y);
    line(points1[i + 4].x, points1[i + 4].y, points1[((i + 1) % 4) + 4].x, points1[((i + 1) % 4) + 4].y);
    // Connect squares
    line(points1[i].x, points1[i].y, points1[i + 4].x, points1[i + 4].y);
  }
}

// --- HELPER FUNCTIONS ---

function vector2Matrix(vector) {
  return [[vector.x], [vector.y], [vector.z]];
}

function matrix2Vector(matrix) {
  return createVector(
    matrix[0][0], 
    matrix[1][0],
    matrix.length > 2 ? matrix[2][0] : undefined
  );
}

function matmul(a, b) {
  let rowsA = a.length;
  let colsA = a[0].length;
  let colsB = b[0].length;
  let res = [];
  for (let i = 0; i < rowsA; i++) {
    let resRow = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      resRow.push(sum);
    }
    res.push(resRow);
  }
  return res;
}