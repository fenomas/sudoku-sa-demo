import { boxSize, getCell, updateView } from '../sudoku/game'

const getCellStyle = (i = 0, j = 0, isErr = false) => {
  const margin = 2
  const mb = i % boxSize === boxSize - 1 ? 20 : margin
  const mr = j % boxSize === boxSize - 1 ? 20 : margin
  return {
    width: '2rem',
    height: '2rem',
    margin: `${margin}px ${mr}px ${mb}px ${margin}px`,
    'text-align': 'center',
    'font-size': '220%',
    'font-family': 'monospace',
    border: isErr ? '2px solid #a00' : '',
    'background-color': isErr ? '#a005' : '',
  } as const
}

export const Cell = (i: number, j: number, value: number, isErr: boolean) => {
  let input!: HTMLInputElement

  const setCell = (i = 0, j = 0, val = '') => {
    const cell = getCell(i, j)
    const num = parseInt(val)
    cell.value = num > 0 ? num : 0
    cell.isFixed = num > 0
    updateView()
  }

  return (
    <input
      id={`cell-${i}-${j}`}
      value={value > 0 ? value : ''}
      ref={input}
      style={getCellStyle(i, j, isErr)}
      onclick={() => {
        input.value = ''
      }}
      oninput={() => {
        setCell(i, j, input.value)
      }}
      onblur={() => {
        setCell(i, j, input.value)
      }}
    />
  )
}
