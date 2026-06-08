"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface ChessPiece {
  type: "K" | "Q" | "R" | "B" | "N" | "P";
  color: "w" | "b";
  symbol: string;
}

type BoardState = (ChessPiece | null)[][];

const INITIAL_BOARD: BoardState = [
  // Rank 8 (Index 0)
  [
    { type: "R", color: "b", symbol: "♜" },
    null,
    { type: "B", color: "b", symbol: "♝" },
    { type: "Q", color: "b", symbol: "♛" },
    { type: "K", color: "b", symbol: "♚" },
    { type: "B", color: "b", symbol: "♝" },
    null,
    { type: "R", color: "b", symbol: "♜" },
  ],
  // Rank 7 (Index 1)
  [
    { type: "P", color: "b", symbol: "♟" },
    { type: "P", color: "b", symbol: "♟" },
    { type: "P", color: "b", symbol: "♟" },
    { type: "P", color: "b", symbol: "♟" },
    null, // e7 empty
    { type: "P", color: "b", symbol: "♟" }, // f7 pawn to be captured
    { type: "P", color: "b", symbol: "♟" },
    { type: "P", color: "b", symbol: "♟" },
  ],
  // Rank 6 (Index 2)
  [null, null, { type: "N", color: "b", symbol: "♞" }, null, { type: "P", color: "b", symbol: "♟" }, null, null, null],
  // Rank 5 (Index 3)
  [null, null, null, null, null, null, null, { type: "Q", color: "w", symbol: "♕" }], // wQ on h5
  // Rank 4 (Index 4)
  [null, null, { type: "B", color: "w", symbol: "♗" }, null, null, null, null, null], // wB on c4
  // Rank 3 (Index 5)
  [null, null, { type: "N", color: "w", symbol: "♘" }, null, null, null, null, null],
  // Rank 2 (Index 6)
  [
    { type: "P", color: "w", symbol: "♙" },
    { type: "P", color: "w", symbol: "♙" },
    { type: "P", color: "w", symbol: "♙" },
    { type: "P", color: "w", symbol: "♙" },
    null,
    { type: "P", color: "w", symbol: "♙" },
    { type: "P", color: "w", symbol: "♙" },
    { type: "P", color: "w", symbol: "♙" },
  ],
  // Rank 1 (Index 7)
  [
    { type: "R", color: "w", symbol: "♖" },
    null,
    null,
    null,
    { type: "R", color: "w", symbol: "♖" },
    null,
    { type: "K", color: "w", symbol: "♔" },
    null,
  ],
];

interface ChessPuzzleProps {
  onClose: () => void;
}

export default function ChessPuzzle({ onClose }: ChessPuzzleProps) {
  const [board, setBoard] = useState<BoardState>(JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(
    "Find the winning move for White! (Mate in 1)"
  );

  const resetPuzzle = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelected(null);
    setSolved(false);
    setFeedback("Find the winning move for White! (Mate in 1)");
  };

  const handleCellClick = (row: number, col: number) => {
    if (solved) return;

    const piece = board[row][col];

    if (selected) {
      const [selRow, selCol] = selected;

      // If clicked same cell, deselect
      if (selRow === row && selCol === col) {
        setSelected(null);
        return;
      }

      const selectedPiece = board[selRow][selCol];

      // Check if player is moving the White Queen (index 3,7 is h5)
      // Winning move: Queen from (3,7) to (1,5) [f7]
      if (selectedPiece && selectedPiece.color === "w") {
        if (selectedPiece.type === "Q" && selRow === 3 && selCol === 7 && row === 1 && col === 5) {
          // Success! Update board
          const newBoard = [...board];
          newBoard[row][col] = selectedPiece;
          newBoard[selRow][selCol] = null;
          setBoard(newBoard);
          setSelected(null);
          setSolved(true);
          setFeedback("Checkmate! Qxf7#. Outstanding tactical vision.");
          triggerConfetti();
        } else {
          // Incorrect move
          setAttempts((prev) => prev + 1);
          setFeedback("Incorrect move. Keep looking! White has checkmate in one.");
          setSelected(null);
        }
      } else {
        setSelected(null);
      }
    } else {
      // Select piece if it is White
      if (piece && piece.color === "w") {
        setSelected([row, col]);
      }
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#8B4513", "#0D6E6E", "#C9972C", "#C0432A"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#8B4513", "#0D6E6E", "#C9972C", "#C0432A"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Convert row, col indexes to chess notation (e.g. 3,7 to h5)
  const getChessCoordinates = (row: number, col: number) => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return files[col] + ranks[row];
  };

  return (
    <motion.div
      className="fixed inset-0 bg-dark/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-sand dark:bg-dark border-4 border-soil dark:border-terminal-green p-6 rounded-none max-w-lg w-full relative brutalist-border shadow-[8px_8px_0px_0px_rgba(139,69,19,1)] dark:shadow-[8px_8px_0px_0px_var(--terminal-green)] text-foreground">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 border-2 border-foreground hover:bg-destructive hover:text-white transition-colors"
          aria-label="Close Chess Easter Egg"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-gold animate-bounce" />
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-soil dark:text-terminal-green">
              Jaffna Defense: Puzzle
            </h2>
          </div>

          <p className="text-center font-mono text-sm mb-4 px-4 bg-muted/10 py-2 border border-border w-full">
            {feedback}
          </p>

          {/* 8x8 Chessboard */}
          <div className="grid grid-cols-8 grid-rows-8 border-4 border-foreground w-full aspect-square max-w-[360px] bg-sand">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
                const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;
                const isTargetHighlight = selected && selected[0] === 3 && selected[1] === 7 && rowIndex === 1 && colIndex === 5;

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`relative flex items-center justify-center w-full aspect-square text-2xl md:text-3xl font-bold transition-all focus:outline-none ${
                      isDarkSquare
                        ? "bg-soil/25 dark:bg-teal/30"
                        : "bg-sand dark:bg-dark"
                    } ${
                      isSelected
                        ? "ring-4 ring-gold z-10 scale-105"
                        : isTargetHighlight && attempts > 1
                        ? "ring-2 ring-rust/50 ring-dashed"
                        : ""
                    } hover:opacity-90`}
                  >
                    {/* Pieces */}
                    {piece && (
                      <motion.span
                        layoutId={`piece-${piece.color}-${piece.type}-${rowIndex}-${colIndex}`}
                        className={`select-none transition-transform duration-200 cursor-pointer ${
                          piece.color === "w"
                            ? "text-soil dark:text-terminal-green drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
                            : "text-dark dark:text-muted drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
                        }`}
                        animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
                      >
                        {piece.symbol}
                      </motion.span>
                    )}

                    {/* Cell coordinates overlay (only on edges) */}
                    {colIndex === 0 && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-mono opacity-40">
                        {8 - rowIndex}
                      </span>
                    )}
                    {rowIndex === 7 && (
                      <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono opacity-40">
                        {["a", "b", "c", "d", "e", "f", "g", "h"][colIndex]}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex gap-4 mt-6 w-full justify-between items-center">
            <div className="text-xs font-mono">
              Attempts: <span className="font-bold text-soil dark:text-terminal-green">{attempts}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetPuzzle}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-foreground hover:bg-soil hover:text-white dark:hover:bg-terminal-green dark:hover:text-dark transition-colors font-mono text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              {solved && (
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 border-2 border-foreground bg-gold text-dark font-bold font-mono text-sm hover:scale-105 transition-transform"
                >
                  Enter Site
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
