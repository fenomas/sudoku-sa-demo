import { render } from 'solid-js/web'
import { SudokuGrid } from './components/SudokuGrid'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found.')
}

render(
  () => (
    <main>
      <h2>Sudoku SA Demo!</h2>
      <SudokuGrid />
    </main>
  ),
  root!
)
