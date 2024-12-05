import { gridData, updateView } from './game'

const presets = {
  Empty: () => '',
  Easy: () => '   26 7 168  7  9 19   45  82 1   4   46 29   5   3 28  93   74 4  5  367 3 18',
  Hard: () => '7   1  9  9     8    49     8  316  2       16 38 75 9 7 96  1 4    57 3      928',
  Random: () =>
    gridData
      .map(() => Math.floor(Math.random() * 15) - 5)
      .map((n) => (n < 1 ? ' ' : '' + n))
      .join(''),
}

export const resetGame = (gameType: keyof typeof presets) => {
  presets[gameType]()
    .padEnd(gridData.length, ' ')
    .slice(0, gridData.length)
    .split('')
    .forEach((s, i) => (gridData[i].value = +s || 0))
  updateView()
  gridData.forEach((cell) => (cell.isFixed = cell.value > 0 && !cell.isErr))
}
