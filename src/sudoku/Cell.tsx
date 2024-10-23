import { boxSize, setGrid } from './game'

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
        setGrid(i, j, parseInt(input.value) || 0)
      }}
      onblur={() => {
        const num = parseInt(input.value) || 0
        if (!(num > 0)) setGrid(i, j, num)
      }}
    />
  )
}
