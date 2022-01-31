import React from 'react';

let defaultMatrix: number[][] = [];
const rIndex1 = 1;
const rIndex2 = 1.5;
const rIndex3 = 2;

const n = 40;

const width = 400;
const height = 400;

const rectHeight: number = width / n;
const rectWidth = rectHeight;

for (let i = 0; i < n; i++) {
  defaultMatrix[i] = [];
  for (let j = 0; j < n; j++) {
    defaultMatrix[i][j] = rIndex1;
  }
}
// for (let i = 0; i < n; i += 5) {
//   for (let j = 1; j < 3; j++) {
//     defaultMatrix[j][i] = rIndex2;
//   }
// }



////////////////////
// const gridWidth = 10;
// const gridGap = 8;

// // const size_t gridWidth = 5; // temporary value
// // const size_t gridGap = 3;    // temporary value

// const gridGapCount = n / gridGap;
// // const size_t gridBeginX = 5;

// const gridBeginX = 6;
// const gridEndX = gridBeginX + gridGap;

// for (let i = gridBeginX; i <= gridEndX; i++) {
//   // Each grid gap.
//   for (let j = 0; j < gridGapCount; j += 2) {
//     for (let k = gridGap * j; k < gridGap * (j + 1); k++) {
//       defaultMatrix[i][k] = rIndex2;
//     }
//   }
// }
////////////////////



interface IReturnObject {
  rectWidth: number;
  rectHeight: number;
  rIndex1: number;
  rIndex2: number;
  rIndex3: number;
  n: number;
}

const returnObj: IReturnObject = {
  rectWidth,
  rectHeight,
  rIndex1,
  rIndex2,
  rIndex3,
  n,
};

interface IContext {
  matrix: number[][];
  setMatrix: React.Dispatch<React.SetStateAction<number[][]>>,
  returnObj: IReturnObject;
}

const RefractionMatrixContext = React.createContext<IContext | null>(null);
// const RefractionMatrixContext = React.createContext(0);



function RefractionMatrixProvider(props: any) {
  const [matrix, setMatrix] = React.useState(defaultMatrix);

  // const value = React.useMemo(() => [matrix, setMatrix], [matrix]);

  return <RefractionMatrixContext.Provider value={{ matrix, setMatrix, returnObj }} {...props} />;
}


function useRefractionMatrix() {
  const context = React.useContext(RefractionMatrixContext);
  if (!context) {
    throw new Error(`useCount must be used within a RefractionMatrixProvider`);
  }
  return context;
}

export { RefractionMatrixProvider, useRefractionMatrix };
