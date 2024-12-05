import { createSignal } from 'solid-js'

/**
 *
 *
 *    signals used for view
 */

export const [currBoardState, setBoardState] = createSignal({ nums: [0], errs: [false] })
export const [currErrCt, setCurrErrCt] = createSignal(1)

/**
 *
 *
 *    sudoku game data and rules
 */

export type Cell = { value: number; isErr: boolean; isFixed: boolean }

export const boxSize = 3
export const size = boxSize * boxSize
export const dataSize = size * size

export const gridData: Cell[] = Array.from(Array(dataSize)).map(() => ({
  value: 0,
  isErr: false,
  isFixed: false,
}))

const coordToIx = (i = 0, j = 0) => i * size + j
export const getCell = (i = 0, j = 0) => gridData[coordToIx(i, j)]

export const countConflictsAt = (ix: number, value: number) => {
  if (value === 0) return 1
  const i = Math.floor(ix / size)
  const j = ix % size

  let errs = 0
  for (let k = 0; k < size; k++) {
    if (k !== j && gridData[coordToIx(i, k)].value === value) errs++
    if (k !== i && gridData[coordToIx(k, j)].value === value) errs++
  }

  const im = Math.floor(i / boxSize) * boxSize
  const jm = Math.floor(j / boxSize) * boxSize
  for (let iv = 0; iv < boxSize; iv++) {
    for (let jv = 0; jv < boxSize; jv++) {
      const jx = coordToIx(im + iv, jm + jv)
      if (ix !== jx && gridData[jx].value === value) errs++
    }
  }
  return errs
}

export const countTotalError = () => {
  return gridData.reduce((acc, cell, i) => acc + countConflictsAt(i, cell.value), 0)
}

export const updateView = () => {
  let errs = 0
  gridData.forEach((cell, i) => {
    const ct = countConflictsAt(i, cell.value)
    cell.isErr = ct > 0
    errs += ct
  })
  setCurrErrCt(errs)

  setBoardState({
    nums: gridData.map((cell) => cell.value),
    errs: gridData.map((cell) => cell.isErr && !cell.isFixed),
  })
}
