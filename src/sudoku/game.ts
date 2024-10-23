import { createEffect, createSignal } from 'solid-js'

/**
 *
 *
 *    sudoku game data and rules
 */

export const boxSize = 3
export const size = boxSize * boxSize
export const dataSize = size * size

export const coordToIx = (i = 0, j = 0) => i * size + j
export const [getData, setData] = createSignal(Array.from(Array(dataSize)).fill(0))

export const getErrs = () => getData().map((val, ix, arr) => countConflicts(arr, ix, val) > 0)
export const getErrCt = () => getErrs().reduce((acc, val) => acc + (val ? 1 : 0), 0)

// accessor for UI to set a single grid cell
export const setGrid = (i: number, j: number, val: number) => {
  const data = getData().slice()
  data[coordToIx(i, j)] = val
  setData(data)
}

export const countConflicts = (data: number[], ix: number, value: number) => {
  if (value === 0) return 1
  const i = Math.floor(ix / size)
  const j = ix % size
  let errs = 0

  for (let k = 0; k < size; k++) {
    if (k !== j && data[coordToIx(i, k)] === value) errs++
    if (k !== i && data[coordToIx(k, j)] === value) errs++
  }

  const im = Math.floor(i / boxSize) * boxSize
  const jm = Math.floor(j / boxSize) * boxSize
  for (let iv = 0; iv < boxSize; iv++) {
    for (let jv = 0; jv < boxSize; jv++) {
      const jx = coordToIx(im + iv, jm + jv)
      if (ix !== jx && data[jx] === value) errs++
    }
  }
  return errs
}
