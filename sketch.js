let points = [];

let angle = 0

function setup() {
  createCanvas(600, 400);

  points[0] = createVector(-0.5, -0.5, -0.5); 
  points[1] = createVector(0.5, -0.5, -0.5);
  points[2] = createVector(0.5, 0.5, -0.5);
  points[3] = createVector(-0.5, 0.5, -0.5);

  points[4] = createVector(-0.5, -0.5, 0.5); 
  points[5] = createVector(0.5, -0.5, 0.5);
  points[6] = createVector(0.5, 0.5, 0.5);
  points[7] = createVector(-0.5, 0.5, 0.5);
}

function draw() {
  background(0);
  translate(width/2, height/2);

  let rotationX = [
    [1, 0, 0],
    [0, cos(angle), -sin(angle)],
    [0, sin(angle), cos(angle)],
  ];

  let rotationY = [
    [cos(angle), 0, -sin(angle)],
    [0, 1, 0],
    [sin(angle), 0, cos(angle)]
  ];

  let rotationZ = [
    [cos(angle), -sin(angle), 0],
    [sin(angle), cos(angle), 0],
    [0, 0, 1]
  ];

  let points1 = [];
  for (let p of points) {
    let matrix = vector2Matrix(p);
    let rotated = matmul(rotationX, matrix);
    rotated = matmul(rotationY, rotated);
    rotated = matmul(rotationZ, rotated);

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

  stroke(255);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < 4; i++) {
    let a = points1[i];
    let b = points1[(i + 1) % 4];
    let c = points1[i + 4];
    let d = points1[(i + 1) % 4 + 4];

    line(a.x, a.y, b.x, b.y);
    line(c.x, c.y, d.x, d.y);
    line(a.x, a.y, c.x, c.y);
  }

  angle += 0.01;
}

function vector2Matrix(vector) {
  return [[vector.x], [vector.y] ,[vector.z]];
}

function matrix2Vector(matrix) {
  let vector = 
    createVector(
      matrix[0][0], 
      matrix[1][0],
      matrix.length > 2 ? matrix[2][0] : undefined);

  return vector;
}

function matmul(a, b) {
  let rowsA = a.length;
  let colsA = a[0].length;
  let rowsB = b.length;
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