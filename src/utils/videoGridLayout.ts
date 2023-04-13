import { IVideoGridLayout } from 'types/share';

interface typeContainer {
  width: number;
  height: number;
}

const gridCalculation = (container: typeContainer, count: number, aspectRatio: number) => {
  let rowsCount = 0;
  let columnsCount = 0;
  let videoWidth = 0;
  for (let i = 1; i <= count; i++) {
    const currentRow = Math.ceil(count / i); //lastRow
    const rowHeight = container.height / currentRow;
    const elementWidth = container.width / i;
    const countInRow = Math.min(elementWidth, rowHeight * aspectRatio);
    if (countInRow > videoWidth) {
      columnsCount = i;
      rowsCount = currentRow;
      videoWidth = countInRow;
    }
  }
  const videoHeight = videoWidth / aspectRatio;

  return { rowsCount, columnsCount, videoWidth, videoHeight };
};

export const getGridLayout = (
  container: typeContainer,
  videoCount: number,
  gridCount: number,
  aspectRatio = 16 / 9,
): IVideoGridLayout[] => {
  let resultArr: IVideoGridLayout[] = [];
  const { rowsCount, columnsCount, videoWidth, videoHeight } = gridCalculation(
    container,
    gridCount,
    aspectRatio,
  );
  const heightSpace = (container.height - rowsCount * videoHeight) / 2;
  const videoInRowCount = Math.ceil(videoCount / columnsCount);

  for (let l = 0; l < videoInRowCount; l++) {
    const sumCount =
      l > 0 && l === videoInRowCount - 1 ? videoCount - l * columnsCount : columnsCount;
    const widthSpace = (container.width - sumCount * videoWidth) / 2;
    for (let e = 0; e < sumCount; e++) {
      const newResultArr = [
        ...resultArr,
        {
          x: widthSpace + e * videoWidth,
          y: heightSpace + l * videoHeight,
          videoWidth,
          videoHeight,
        },
      ];
      resultArr = [...newResultArr];
    }
  }
  return resultArr;
};
