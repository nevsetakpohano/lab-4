const canvasNeNapr = document.getElementById("neNapr");
const canvasNapr = document.getElementById("napr");
const contextNeNapr = canvasNeNapr.getContext("2d");
const contextNapr = canvasNapr.getContext("2d");

const canvasCond = document.getElementById("condGraph");
const contextCond = canvasCond.getContext("2d");

let qntnNodes = 10;
const coef1 = 1.0 - 0 * 0.01 - 1 * 0.01 - 0.3;
const coef2 = 1.0 - 0 * 0.005 - 1 * 0.005 - 0.27;
const radius = 15;

const nodePositions = [
  { x: 120, y: 250 }, //1
  { x: 200, y: 150 }, //2
  { x: 300, y: 110 }, //3
  { x: 400, y: 150 }, //4
  { x: 480, y: 250 }, //5
  { x: 480, y: 350 }, //6
  { x: 400, y: 450 }, //7
  { x: 300, y: 490 }, //8
  { x: 200, y: 450 }, //9
  { x: 120, y: 350 }, //10
];

function generateAdjacencyMatrixSymmetrical(coef) {
  const seed = 3301;
  let matrix = [];
  Math.seedrandom(seed);
  for (let i = 0; i < qntnNodes; i++) {
    matrix[i] = [];
    for (let j = 0; j < qntnNodes; j++) {
      matrix[i][j] = Math.random() * 2 * coef1;
      matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
    }
  }
  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] === 1 && matrix[i][j] !== matrix[j][i]) {
        matrix[j][i] = 1;
      }
    }
  }
  return matrix;
}

function generateAdjacencyMatrixNotSymmetrical(coef) {
  const seed = 3301;
  let matrix = [];
  Math.seedrandom(seed);
  for (let i = 0; i < qntnNodes; i++) {
    matrix[i] = [];
    for (let j = 0; j < qntnNodes; j++) {
      matrix[i][j] = Math.random() * 2 * coef;
      matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
    }
  }
  return matrix;
}

function drawAllNodes(context, colour, txtColour, neededNodePositions) {
  neededNodePositions.forEach((position, index) => {
    if (index < qntnNodes) {
      context.fillStyle = colour;
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
      context.fill();
      context.stroke();
      context.font = "14px Times New Roman";
      context.fillStyle = txtColour;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(`${index + 1}`, position.x, position.y);
    }
  });
}

function drawNode(index, context, bgColour, txtColour) {
  context.fillStyle = bgColour;
  context.strokeStyle = "black";
  context.lineWidth = 2;

  context.beginPath();
  context.arc(
    nodePositions[index].x,
    nodePositions[index].y,
    radius,
    0,
    Math.PI * 2,
    true
  );
  context.fill();
  context.stroke();
  context.font = "14px Times New Roman";
  context.fillStyle = txtColour;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    `${index + 1}`,
    nodePositions[index].x,
    nodePositions[index].y
  );
}

const drawArrow = (x, y, context, angle, size) => {
  const arrowSize = size;

  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.moveTo(0, 0);
  context.lineTo(arrowSize, -arrowSize);
  context.lineTo(0, 0);
  context.lineTo(arrowSize, arrowSize);
  context.closePath();
  context.restore();
};

function drawEdgeArrow(fromNode, toNode, context, neededNodePositions) {
  const startX = neededNodePositions[fromNode].x;
  const startY = neededNodePositions[fromNode].y;
  const endX = neededNodePositions[toNode].x;
  const endY = neededNodePositions[toNode].y;
  const angle = Math.atan2(startY - endY, startX - endX);
  const indentX = radius * Math.cos(angle);
  const indentY = radius * Math.sin(angle);
  drawArrow(endX + indentX, endY + indentY, context, angle, 4);
}

function drawEdge(
  fromNode,
  toNode,
  context,
  colour,
  lineWidth,
  neededNodePositions
) {
  const startX = neededNodePositions[fromNode].x;
  const startY = neededNodePositions[fromNode].y;
  const endX = neededNodePositions[toNode].x;
  const endY = neededNodePositions[toNode].y;
  context.strokeStyle = colour;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.stroke();
  context.closePath();
}

function drawAllEdges(matrix, context, neededNodePositions) {
  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] === 1) {
        if (neededNodePositions === nodePositions) {
          drawEdge(i, j, context, "black", 2, nodePositions);
        } else if (neededNodePositions === nodePositionsCond) {
          drawEdge(i, j, context, "black", 2, nodePositionsCond);
        }

        if (context === contextNapr || context === contextCond) {
          if (neededNodePositions === nodePositions) {
            drawEdgeArrow(i, j, context, nodePositions);
          } else if (neededNodePositions === nodePositionsCond) {
            drawEdgeArrow(i, j, context, nodePositionsCond);
          }
        }
        if (i === j) {
          context.beginPath();
          const endX = neededNodePositions[j].x;
          const endY = neededNodePositions[j].y;
          if (i < 5) {
            context.arc(
              endX,
              endY - radius * 2,
              radius,
              -Math.PI / 2,
              (3 * Math.PI) / 2,
              true
            );
            if (context === contextNapr || context === contextCond) {
              drawArrow(
                neededNodePositions[i].x + 5,
                neededNodePositions[i].y - 15,
                context,
                -Math.PI / 4,
                4
              );
            }
            context.stroke();
          } else {
            context.arc(
              endX,
              endY + radius * 2,
              radius,
              Math.PI / 2,
              (-3 * Math.PI) / 2,
              true
            );
            if (context === contextNapr || context === contextCond) {
              drawArrow(
                neededNodePositions[i].x + 5,
                neededNodePositions[i].y + 15,
                context,
                Math.PI / 4,
                4
              );
            }
            context.stroke();
          }
        }
        context.stroke();
      }
    }
  }
}

const matrixSymmetrical = generateAdjacencyMatrixSymmetrical(coef1);
console.log("Symmetrical matrix : ", matrixSymmetrical);

const matrixNotSymmetrical = generateAdjacencyMatrixNotSymmetrical(coef1);
console.log("Not symmetrical matrix : ", matrixNotSymmetrical);

drawAllEdges(matrixNotSymmetrical, contextNapr, nodePositions);
drawAllEdges(matrixSymmetrical, contextNeNapr, nodePositions);

drawAllNodes(contextNeNapr, "#DAB785", "black", nodePositions);
drawAllNodes(contextNapr, "#DAB785", "black", nodePositions);
