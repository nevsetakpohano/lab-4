function countDegrees(matrix) {
  const degrees = {};
  for (let i = 0; i < qntnNodes; i++) {
    degrees[i] = { degree: 0, inDegree: 0, outDegree: 0 };
  }

  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] === 1) {
        degrees[i].degree++;
        degrees[j].degree++;
        degrees[i].outDegree++;
        degrees[j].inDegree++;
      }
    }
  }

  return degrees;
}

function isGraphRegular(degrees) {
  const firstDegree = degrees[0].degree;
  for (const node in degrees) {
    if (degrees[node].degree !== firstDegree) {
      return console.log("Graph is not regular");
    }
  }
  return console.log(
    "Graph is regular, degree of regularity is " + firstDegree
  );
}

function printHangingAndIsolatedNodes(degrees) {
  const hangingNodes = [];
  const isolatedNodes = [];

  for (const node in degrees) {
    if (degrees[node].degree === 1) {
      hangingNodes.push(node);
    } else if (degrees[node].degree === 0) {
      isolatedNodes.push(node);
    }
  }

  console.log(
    "Hanging vertices:",
    hangingNodes.length > 0 ? hangingNodes : "There is none"
  );
  console.log(
    "Isolated vertices:",
    isolatedNodes.length > 0 ? isolatedNodes : "There is none"
  );
}

function multiplyMatrices(matrix1, matrix2) {
  const multipliedMatrices = [];
  for (let i = 0; i < matrix1.length; i++) {
    multipliedMatrices[i] = [];
    for (let j = 0; j < matrix2[0].length; j++) {
      multipliedMatrices[i][j] = 0;
      for (let k = 0; k < matrix1[0].length; k++) {
        multipliedMatrices[i][j] += matrix1[i][k] * matrix2[k][j];
      }
    }
  }
  return multipliedMatrices;
}

function findPathsLength2(matrix) {
  const paths = [];

  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] != 0) {
        for (let k = 0; k < qntnNodes; k++) {
          if (matrix[j][k] != 0) {
            paths.push([i, j, k]);
          }
        }
      }
    }
  }

  return paths;
}

function findPathsLength3(matrix) {
  const paths = [];

  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (matrix[i][j] != 0) {
        for (let k = 0; k < qntnNodes; k++) {
          if (matrix[j][k] != 0) {
            for (let l = 0; l < qntnNodes; l++) {
              if (matrix[k][l] != 0) {
                paths.push([i, j, k, l]);
              }
            }
          }
        }
      }
    }
  }

  return paths;
}

function countPaths(matrix) {
  const A2 = multiplyMatrices(matrix, matrix);
  const A3 = multiplyMatrices(A2, matrix);

  console.log("Matrix A2 : ", A2);
  console.log("Matrix A3 : ", A3);

  console.log("Paths of length 2:");
  const pathsLength2 = findPathsLength2(matrix);
  pathsLength2.forEach((path) =>
    console.log(path.map((v) => v + 1).join(" -> "))
  );

  console.log("Paths of length 3:");
  const pathsLength3 = findPathsLength3(matrix);
  pathsLength3.forEach((path) =>
    console.log(path.map((v) => v + 1).join(" -> "))
  );
}

const degreesSymmetrical = countDegrees(matrixSymmetrical);
console.log("Degrees of symmetrical matrix : ");
console.log(degreesSymmetrical);
isGraphRegular(degreesSymmetrical);
printHangingAndIsolatedNodes(degreesSymmetrical);
countPaths(matrixSymmetrical);

const degreesNotSymmetrical = countDegrees(matrixNotSymmetrical);
console.log("Degrees of not symmetrical matrix : ");
console.log(degreesNotSymmetrical);
isGraphRegular(degreesNotSymmetrical);
printHangingAndIsolatedNodes(degreesNotSymmetrical);
countPaths(matrixNotSymmetrical);
