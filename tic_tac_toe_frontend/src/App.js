import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders a two-player Tic Tac Toe game with an Executive Gray theme.
 * - Renders a centered 3x3 grid
 * - Alternating turns between X and O
 * - Detects wins (rows, columns, diagonals) and draws
 * - Displays status text and a Reset button
 * - Accessible with aria-labels and keyboard focus styles
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Derived state
  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => squares.every(Boolean) && !winnerInfo.winner,
    [squares, winnerInfo.winner]
  );

  const currentPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /** Handle a user clicking on a square. */
    if (squares[index] || winnerInfo.winner) return; // ignore if occupied or game over

    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    /** Reset the game board and state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winnerInfo.winner
    ? `Winner: ${winnerInfo.winner}`
    : isDraw
      ? `It’s a draw`
      : `Next player: ${currentPlayer}`;

  return (
    <div className="app-root">
      <main className="game-shell" role="main" aria-label="Tic Tac Toe game">
        <section className="panel">
          <h1 className="title">Tic Tac Toe</h1>
          <p
            className={`status ${winnerInfo.winner ? 'status--win' : isDraw ? 'status--draw' : 'status--next'}`}
            data-testid="status-text"
            aria-live="polite"
          >
            {statusText}
          </p>

          <Board
            squares={squares}
            winningLine={winnerInfo.line}
            onSquareClick={handleSquareClick}
            currentPlayer={currentPlayer}
            gameOver={Boolean(winnerInfo.winner) || isDraw}
          />

          <div className="controls">
            <button
              type="button"
              className="btn reset-btn"
              onClick={handleReset}
              aria-label="Reset game"
              data-testid="reset-button"
            >
              Reset
            </button>
          </div>

          <footer className="legend" aria-hidden="true">
            <span className="legend-item">
              <span className="legend-swatch swatch-current" /> Current turn
            </span>
            <span className="legend-item">
              <span className="legend-swatch swatch-win" /> Win line
            </span>
            <span className="legend-item">
              <span className="legend-swatch swatch-disabled" /> Played square
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders a 3x3 grid of Square components.
 */
function Board({ squares, onSquareClick, winningLine = [], currentPlayer, gameOver }) {
  return (
    <div
      className="board"
      role="grid"
      aria-label="3 by 3 grid Tic Tac Toe board"
    >
      {squares.map((value, idx) => {
        const isWinning = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            index={idx}
            value={value}
            isWinning={isWinning}
            onClick={() => onSquareClick(idx)}
            disabled={Boolean(value) || gameOver}
            currentPlayer={currentPlayer}
          />
        );
      })}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square renders a button representing a cell on the board.
 */
function Square({ index, value, onClick, disabled, isWinning, currentPlayer }) {
  const aria = value
    ? `Square ${index + 1}, ${value}`
    : `Square ${index + 1}, empty. ${disabled ? '' : `Plays ${currentPlayer}`}`;

  return (
    <button
      type="button"
      className={`square ${value ? 'square--filled' : ''} ${isWinning ? 'square--win' : ''}`}
      onClick={onClick}
      aria-label={aria}
      disabled={disabled}
      data-testid={`square-${index}`}
    >
      <span className="mark" aria-hidden="true">{value}</span>
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner determines if a winning line exists.
 * Returns { winner: 'X' | 'O' | null, line: number[] }
 */
function calculateWinner(sq) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (const [a, b, c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return { winner: sq[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

export default App;
