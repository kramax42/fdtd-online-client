// https://codesandbox.io/s/blov5kowy?file=/index.js:0-1633

import * as React from 'react';
import styles from './MatrixEditor.module.scss';
import { MatrixEditorProps } from './MatrixEditor.props';
import { Button } from 'components';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { LabNames } from 'types/types';
import { selectLabName } from 'app/reducers/labTypeSlice';
import {
  selectEpsilonMatrix,
  selectEpsilonMatrixCountRow,
  selectEpsilonMatrixCountCol,
  selectEpsilonMatrixValues,
  setEpsilonMatrix,
  updateMediumMatrixes,
  setRefractiveIndexes,
  selectOmegaMatrixValues,
} from 'app/reducers/medium-matrix.reducer';
import DragAndDrop from './DragAndDrop';

const colors = ['#fafafa', 'tomato', '#1a52aa'];

const MatrixEditor: React.FC<MatrixEditorProps> = ({ setIsOpend }) => {
  //   const [isOpened, setIsOpend] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const currentLabName = useAppSelector(selectLabName);
  React.useEffect(() => {
    console.log(currentLabName);
  }, [currentLabName]);

  const resetMatrix = (currentLabName: LabNames) => {
    dispatch(setEpsilonMatrix({ currentLabName }));
  };

  React.useEffect(() => {
    if (currentLabName == LabNames.LAB_2D) {
      // dispatch(setRefractiveIndexes([4.85418e-12, (4.85418e-12)*3, (4.85418e-12)*5]))
      dispatch(setRefractiveIndexes([1, 4, 6]));
      dispatch(
        setEpsilonMatrix({ currentLabName, newCountRow: 1, newCountCol: 25 })
      );
    } else {
      dispatch(setRefractiveIndexes([1, 10, 14]));
      dispatch(
        setEpsilonMatrix({ currentLabName, newCountRow: 40, newCountCol: 40 })
        // setEpsilonMatrix({ currentLabName, newCountRow: 80, newCountCol: 80 })
      );
    }
    // }, []);
  }, [currentLabName]);

  // -8***************---------------------------------------------------------------
  // Matrix sizes.
  const width = 400;
  const height = 400;

  const countRow = useAppSelector(selectEpsilonMatrixCountRow);
  const countCol = useAppSelector(selectEpsilonMatrixCountCol);
  const matrix = useAppSelector(selectEpsilonMatrix);
  const rIndexes = useAppSelector(selectEpsilonMatrixValues);
  const omegas = useAppSelector(selectOmegaMatrixValues);

  // React.useEffect(() => {
  //   console.log(matrix);
  //   console.log(rIndexes);
  // }, [matrix, rIndexes]);

  const rectWidth = width / countCol;
  const rectHeight = height / countRow;

  const [mousePressed, setMousePressed] = React.useState(false);

  //  const dispatch = useAppDispatch();

  // Under matrix panel size.
  const panelHeight = 70;

  const [currentShape, setCurrentShape] = React.useState(1);

//   const panelPaddingY = height + Math.min(rectWidth, rectHeight) + 10;
    const panelPaddingY = rectHeight * 5;
  const panelPaddingX = rectHeight*8;

  // Panel with refraction index shapes.
  let panelShapes = new Array(rIndexes.length).fill({}).map((_, index) => ({
    type: 'rect',
    x: panelPaddingX * (index + 1),
    y: panelPaddingY,
    width: rectHeight*6,
    height: rectHeight*6,
    rIndex: rIndexes[index],
    omega: omegas[index],
    color: colors[index],
  }));

  const initialFocusedCoords = { i: 0, j: 0 };

  const [focusedCoord, setFocusedCoord] = React.useState(initialFocusedCoords);

  // Handlers.
  const handleMouseClick = () => {
    const newJ = focusedCoord.j;
    const newI = focusedCoord.i;

    dispatch(
      updateMediumMatrixes({
        i: newI,
        j: newJ,
        newEpsilonValue: panelShapes[currentShape].rIndex,
        newOmegaValue: panelShapes[currentShape].omega,
      })
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mousePressed) {
      setMousePressed(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mousePressed) {
      setMousePressed(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Save the values of pageX and pageY and use it within setPosition.
    const pageX = e.clientX;
    const pageY = e.clientY;

    const { x: gridX, y: gridY } = (
      e.target as Element
    ).getBoundingClientRect();

    const x = pageX - gridX - rectWidth / 2;
    const y = pageY - gridY - rectHeight / 2;

    const newFocusedCol = Math.round((countCol * x) / width);
    const newFocusedRow = Math.round((countRow * y) / height);
    setFocusedCoord({
      j: newFocusedCol,
      i: newFocusedRow,
    });

    if (mousePressed) {
      dispatch(
        updateMediumMatrixes({
          i: newFocusedRow,
          j: newFocusedCol,
          newEpsilonValue: panelShapes[currentShape].rIndex,
          newOmegaValue: panelShapes[currentShape].omega,
        })
      );
    }
  };
  // -8***************---------------------------------------------------------------

  return (
    <>
      <div className={styles.substrate}></div>

      <div className={styles.modalWrapper}>
        <div className={styles.matrixPicker}>
          <h2>Matrix picker</h2>
          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />

          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />

          <svg className={styles.matrixPreview} />
          <svg className={styles.matrixPreview} />
          
        </div>
        <div className={styles.editor}>
          <h2>Editor</h2>
          {/* Editor start */}

          <>
            <svg
              style={{
                height: height + panelHeight + 'px',
                width: width + 'px',
              }}
            >
              <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={colors[0]}
                onClick={handleMouseClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />

              {matrix.map((row, i) => {
                return row.map((item: number, j: number) => {
                  const colorIndex = panelShapes.findIndex(
                    (panel) => panel.rIndex == item
                  );
                  if (colorIndex > 0) {
                    return (
                      <rect
                        key={i + '' + j}
                        width={rectWidth}
                        height={rectHeight}
                        x={j * rectWidth}
                        y={i * rectHeight}
                        fill={panelShapes[colorIndex].color}
                        // Element is invisible for clicks.
                        style={{ pointerEvents: 'none' }}
                      />
                    );
                  }
                });
              })}

              {/* Focused rect */}
              <rect
                width={rectWidth}
                height={rectHeight}
                x={focusedCoord.j * rectWidth}
                y={focusedCoord.i * rectHeight}
                fill='gray'
                opacity='0.4'
                // Element is invisible for clicks.
                style={{ pointerEvents: 'none' }}
              />
            </svg>
          </>
          {/* Editor end */}

          <div className={styles.buttons}>
            <Button onClick={() => resetMatrix(currentLabName)}>Reset</Button>
            <Button onClick={() => setIsOpend(false)}>Back</Button>
          </div>
        </div>
        <div className={styles.materialPicker}>
          <h2>Material picker</h2>
          <svg>
          {panelShapes.map((shape, index) => {
            switch (shape.type) {
              case 'rect':
                return (
                  
                    <React.Fragment key={index + shape.x}>
                      <rect
                        fill={shape.color}
                        stroke='black'
                        strokeWidth={index == currentShape ? '2px' : '0px'}
                        strokeOpacity='1'
                        x={shape.x}
                        y={shape.y}

                        // width={Math.min(shape.width, shape.height)}
                        // height={Math.min(shape.width, shape.height)}
                        width={shape.width}
                        height={shape.width}
                        onClick={() => setCurrentShape(index)}
                      />
                      <text
                        x={shape.x}
                        y={shape.y + rectHeight * 3}
                        className={styles.heavy}
                      >
                        {shape.rIndex}
                      </text>
                    </React.Fragment>
                  
                );
            }
          })}
          </svg>
        </div>
        {/* <DragAndDrop WIDTH={400} HEIGHT={400} /> */}
      </div>
    </>
  );
};

export default MatrixEditor;