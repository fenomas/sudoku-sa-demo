import { createSignal } from 'solid-js'
import {
  countConflictsAt,
  countTotalError,
  currErrCt,
  gridData,
  setCurrErrCt,
  size,
  updateView,
} from './game'

// state and interface
export const [isSolving, setIsSolving] = createSignal(false)
export const [numIters, setNumIters] = createSignal(0)
export const [currTemp, setCurrTemp] = createSignal(1)
export const [currK, setCurrK] = createSignal(1)

let iterateFn = (n = 0) => {}

export const startSolving = () => {
  setNumIters(0)
  iterateFn = initSolver()
  setIsSolving(true)
  runSA()
}
export const stopSolving = () => {
  setIsSolving(false)
}

// RAF loop
const runSA = () => {
  iterateFn()
  updateView()
  if (currErrCt() === 0) setIsSolving(false)
  if (isSolving()) requestAnimationFrame(runSA)
}

// helpers to make the iterate function understandable
const rand = (n = 1) => Math.floor(Math.random() * n)

/**
 *
 *
 *   Data and Simulated Annealing solver
 */

import { AnnealingSolver } from 'abstract-sim-anneal'

const initSolver = () => {
  // solver state is available numbers after removing vals of fixed cells
  const nums = Array.from(Array(size)).map((_, i) => Array.from(Array(size)).fill(i + 1))
  gridData.forEach((cell) => {
    if (cell.isFixed) nums[cell.value - 1].pop()
  })
  const state = nums.flat()
  const indexes = gridData.map((cell, i) => (cell.isFixed ? -1 : i)).filter((ix) => ix >= 0)
  indexes.forEach((ix, i) => {
    gridData[ix].value = state[i]
  })

  // solver init
  const solver = new AnnealingSolver<number[], number[]>({
    chooseMove: (state) => {
      let [i, j] = [rand(state.length), rand(state.length)]
      if (i === j) j = (i + 1) % state.length
      const [ix, jx] = [indexes[i], indexes[j]]
      const err1 = countConflictsAt(ix, state[i]) + countConflictsAt(jx, state[j])
      const err2 = countConflictsAt(ix, state[j]) + countConflictsAt(jx, state[i])
      return { errorDelta: err2 - err1, move: [i, j] }
    },
    applyMove: (state, [i, j]) => {
      ;[state[i], state[j]] = [state[j], state[i]]
      gridData[indexes[i]].value = state[i]
      gridData[indexes[j]].value = state[i]
      return state
    },
  })

  solver.iterationBudget = 1e6
  const itersPerFrame = 1e4

  return () => {
    solver.run(state, itersPerFrame)
    setNumIters((n) => n + itersPerFrame)
    setCurrTemp(solver.currentTemperature)
    setCurrK(solver.k || solver.learnedK)
  }
}
