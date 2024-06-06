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

function reachabilityMatrix(adjacencyMatrix) {
  let reachability = Array.from({ length: qntnNodes }, () =>
    Array(qntnNodes).fill(0)
  );

  for (let i = 0; i < qntnNodes; i++) {
    for (let j = 0; j < qntnNodes; j++) {
      if (adjacencyMatrix[i][j] === 1) {
        reachability[i][j] = 1;
      }
    }
  }

  for (let k = 0; k < qntnNodes; k++) {
    for (let i = 0; i < qntnNodes; i++) {
      for (let j = 0; j < qntnNodes; j++) {
        if (reachability[i][k] && reachability[k][j]) {
          reachability[i][j] = 1;
        }
      }
    }
  }

  return reachability;
}

function strongComponents(adjacencyMatrix) {
  let index = 0;
  const stack = [];
  const visited = new Array(qntnNodes).fill(-1);
  const min = new Array(qntnNodes).fill(-1);
  const inStack = new Array(qntnNodes).fill(false);
  const components = [];

  function findComp(v) {
    visited[v] = min[v] = index++;
    stack.push(v);
    inStack[v] = true;

    for (let w = 0; w < qntnNodes; w++) {
      if (adjacencyMatrix[v][w] !== 0) {
        if (visited[w] === -1) {
          findComp(w);
          min[v] = Math.min(min[v], min[w]);
        } else if (inStack[w]) {
          min[v] = Math.min(min[v], visited[w]);
        }
      }
    }

    if (min[v] === visited[v]) {
      const component = [];
      let w;
      do {
        w = stack.pop();
        inStack[w] = false;
        component.push(w);
      } while (w !== v);
      components.push(component);
    }
  }

  for (let i = 0; i < qntnNodes; i++) {
    if (visited[i] === -1) {
      findComp(i);
    }
  }

  return components;
}

function createStrongConnectivityMatrix(adjacencyMatrix, components) {
  const n = components.length;
  const componentIndex = new Map();

  components.forEach((component, index) => {
    component.forEach((vertex) => {
      componentIndex.set(vertex, index);
    });
  });

  const strongConnectivityMatrix = Array.from({ length: n }, () =>
    Array(n).fill(0)
  );

  for (let v = 0; v < adjacencyMatrix.length; v++) {
    for (let w = 0; w < adjacencyMatrix[v].length; w++) {
      if (adjacencyMatrix[v][w] !== 0) {
        const vComponent = componentIndex.get(v);
        const wComponent = componentIndex.get(w);
        if (vComponent !== wComponent) {
          strongConnectivityMatrix[vComponent][wComponent] = 1;
        }
      }
    }
  }

  return strongConnectivityMatrix;
}

const components = strongComponents(matrixNotSymmetrical);
console.log("Components of Strong Connectivity:");
components.forEach((component, index) => {
  console.log(`Component ${index + 1}: ${component}`);
});

const degreesSymmetrical = countDegrees(matrixSymmetrical);
console.log("Degrees of symmetrical matrix : ");
console.log(degreesSymmetrical);
isGraphRegular(degreesSymmetrical);
printHangingAndIsolatedNodes(degreesSymmetrical);
countPaths(matrixSymmetrical);
let reachabilitySymmetrical = reachabilityMatrix(matrixNotSymmetrical);
console.log(reachabilitySymmetrical);

const degreesNotSymmetrical = countDegrees(matrixNotSymmetrical);
console.log("Degrees of not symmetrical matrix : ");
console.log(degreesNotSymmetrical);
isGraphRegular(degreesNotSymmetrical);
printHangingAndIsolatedNodes(degreesNotSymmetrical);
countPaths(matrixNotSymmetrical);
let reachabilityNotSymmetrical = reachabilityMatrix(matrixNotSymmetrical);
console.log(reachabilityNotSymmetrical);

const strongConnectivityMatrix = createStrongConnectivityMatrix(
  matrixNotSymmetrical,
  components
);
console.log("Strong Connectivity Matrix:");
console.log(strongConnectivityMatrix);

qntnNodes = strongConnectivityMatrix.length;

const nodePositionsCond = [
  { x: 120, y: 250 }, //1
  { x: 480, y: 350 }, //6
  { x: 200, y: 450 }, //9
  { x: 400, y: 150 }, //4
  { x: 300, y: 490 }, //8
  { x: 200, y: 150 }, //2
  { x: 480, y: 250 }, //5
  { x: 400, y: 450 }, //7
  { x: 120, y: 350 }, //10
  { x: 300, y: 110 }, //3
];

drawAllEdges(strongConnectivityMatrix, contextCond, nodePositionsCond);
drawAllNodes(contextCond, "#DAB785", "black", nodePositionsCond);
