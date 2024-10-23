import { Cell } from './Cell'
import { size, getData, getErrs, coordToIx, getErrCt } from './game'
import { currTemp, isSolving, numIters, startSolving, stopSolving } from './solver'
import { resetGame } from './presets'

const GridView = () => {
  const arr = Array.from(Array(size))
  return arr.map((_, i) => (
    <div>
      {arr.map((_, j) => {
        const ix = coordToIx(i, j)
        const val = getData()[ix]
        const isErr = val > 0 && getErrs()[ix]
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
    <span>Error: {getErrCt()}</span>
    <br />
    <span>Temp: {currTemp().toFixed(5)}</span>
  </div>
)

export const SudokuGrid = () => {
  return (
    <>
      <GridView />
      <PresetButtons />
      {getErrCt() === 0 ? <h1>Done!</h1> : isSolving() ? <StopButton /> : <StartButton />}
      <Stats />
    </>
  )
}
