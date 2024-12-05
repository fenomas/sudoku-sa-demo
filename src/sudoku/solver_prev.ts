// working
import { createSignal } from 'solid-js'
import { coordToIx, getData, setData, size, countErrors } from './game'

// state and interface
export const [isSolving, setIsSolving] = createSignal(false)
export const [numIters, setNumIters] = createSignal(0)
export const [currTemp, setCurrTemp] = createSignal(1)

export const startSolving = () => {
  data = getData().slice()
  setNumIters(0)
  initSolver()
  setIsSolving(true)
  runSA()
}
export const stopSolving = () => {
  setIsSolving(false)
}

// RAF loop
const runSA = () => {
  const iter = 10000
  for (let i = 0; i < iter; i++) {
    iterate()
    if (totalErr === 0) {
      stopSolving()
      break
    }
  }
  setNumIters((n) => n + iter)
  setCurrTemp(temp)
  setData(data.slice())
  if (isSolving()) requestAnimationFrame(runSA)
}

// helpers to make the iterate function understandable
const rand = (n = 1) => Math.floor(Math.random() * n)
const randomCoord = (): [number, number] => {
  const [i, j] = [rand(size), rand(size)]
  return wasSolved[coordToIx(i, j)] ? randomCoord() : [i, j]
}
const measureError = (i: number, j: number, val: number) =>
  countErrors(data, coordToIx(i, j), val)
const updateTotalError = () =>
  (totalErr = data.reduce((acc, val, ix) => acc + countErrors(data, ix, val), 0))
const getGridValue = (i: number, j: number) => data[coordToIx(i, j)]
const setGridValue = (i: number, j: number, val: number) => (data[coordToIx(i, j)] = val)
const randomDifferentValue = (oldVal: number): number => {
  const val = rand(size) + 1
  return val === oldVal ? randomDifferentValue(oldVal) : val
}

/**
 *
 *
 *   Simulated Annealing
 */

let temp = 1
let totalErr = 1
let data = getData().slice()
let wasSolved = data.map(() => false)

const initSolver = () => {
  temp = 0.5
  // remember which cells started out solved, and what they were
  wasSolved = data.map((val, ix) => val > 0 && countErrors(data, ix, val) === 0)
  const numsUsed = Array.from(Array(size)).fill(0)
  wasSolved.forEach((solved, ix) => {
    if (solved) numsUsed[data[ix] - 1]++
  })
  // fill in the rest with whatever
  data.forEach((_, ix) => {
    if (wasSolved[ix]) return
    numsUsed.some((ct, i) => {
      if (ct < size) {
        data[ix] = i + 1
        numsUsed[i]++
        return true
      }
    })
  })
  updateTotalError()
}

/**
 *
 *
 *  core solver logic
 *
 *
 */

const iterate = () => {
  temp *= 0.9999999
  const [i, j] = randomCoord()
  const [x, y] = randomCoord()

  const val = getGridValue(i, j)
  const val2 = getGridValue(x, y)
  if (val === val2) return iterate()

  const err = measureError(i, j, val) + measureError(x, y, val2)
  const err2 = measureError(i, j, val2) + measureError(x, y, val)

  if (shouldSwap(err2 - err)) {
    setGridValue(i, j, val2)
    setGridValue(x, y, val)
    updateTotalError()
  }
}

const shouldSwap = (errDiff: number) => {
  if (errDiff < 0) return true
  return Math.random() < Math.exp(-errDiff / temp)
}
