import { Cell } from './Cell'
import { currK, currTemp, isSolving, numIters, startSolving, stopSolving } from '../sudoku/solver'
import { resetGame } from '../sudoku/presets'
import { size, currBoardState, currErrCt } from '../sudoku/game'

const GridView = () => {
  const arr = Array.from(Array(size))
  return arr.map((_, i) => (
    <div>
      {arr.map((_, j) => {
        const ix = i * size + j
        const state = currBoardState()
        const val = state.nums[ix]
        const isErr = state.errs[ix]
        return Cell(i, j, val, isErr)
      })}
    </div>
  ))
}

const PresetButtons = () => {
  const buts = ['Empty', 'Easy', 'Hard', 'Random'] as const
  return (
    <div>
      {buts.map((label) => (
        <button onclick={() => resetGame(label)} disabled={isSolving()}>
          {label}
        </button>
      ))}
    </div>
  )
}

const StartButton = () => (
  <button
    onclick={startSolving}
    style={{
      'font-size': '150%',
    }}
  >
    Solve!
  </button>
)

const StopButton = () => <button onclick={stopSolving}>Stop</button>

const Stats = () => (
  <div>
    <span>Iterations: {numIters()}</span>
    <br />
    <span>Error: {currErrCt()}</span>
    <br />
    <span>K: {currK().toFixed(3)}</span>
    <br />
    <span>Temp: {currTemp().toFixed(8)}</span>
  </div>
)

export const SudokuGrid = () => {
  return (
    <>
      <GridView />
      <PresetButtons />
      {currErrCt() === 0 ? <h1>Done!</h1> : isSolving() ? <StopButton /> : <StartButton />}
      <Stats />
    </>
  )
}
