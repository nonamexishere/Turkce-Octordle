import React from 'react';
import { useGame } from '../../context/GameContext';

const Board = ({ word, boardIndex }) => {
  const { guesses, maxGuesses, getBoardStatus, currentGuess } = useGame();
  const solvedInGuesses = getBoardStatus(boardIndex);

  // Gösterilecek tahminleri belirle
  const displayedGuesses = solvedInGuesses 
    ? guesses.slice(0, solvedInGuesses) 
    : guesses;

  // Türkçe karakter düzeltmeleri
  const toTurkishUpperCase = (char) => {
    const map = {
      'i': 'İ',
      'ı': 'I',
      'ğ': 'Ğ',
      'ü': 'Ü',
      'ş': 'Ş',
      'ö': 'Ö',
      'ç': 'Ç'
    };
    return map[char] || char.toUpperCase();
  };

  const getSquareColor = (result) => {
    switch (result) {
      case 'correct': return 'bg-green-500 border-green-600 text-white';
      case 'present': return 'bg-yellow-500 border-yellow-600 text-white';
      case 'wrong': return 'bg-gray-500 border-gray-600 text-white';
      default: return 'bg-white border-gray-300';
    }
  };

  return (
    <div className="game-board">
      <div className="text-sm font-medium text-gray-500 mb-1 flex justify-between items-center">
        <span className={`font-bold ${solvedInGuesses ? 'text-green-500' : ''}`}>
          {boardIndex + 1}
        </span>
        {solvedInGuesses && (
          <span className="text-green-500 font-bold">{solvedInGuesses}/13</span>
        )}
      </div>
      <div className="grid gap-0.5">
        {Array(maxGuesses).fill(null).map((_, rowIndex) => {
          const guess = displayedGuesses[rowIndex];
          const isCurrentRow = !solvedInGuesses && rowIndex === guesses.length;
          
          return (
            <div key={rowIndex} className="grid grid-cols-5 gap-0.5">
              {Array(5).fill(null).map((_, colIndex) => {
                let content = '';
                let squareClass = 'bg-white border-gray-300';

                if (guess) {
                  content = toTurkishUpperCase(guess.word[colIndex]);
                  squareClass = getSquareColor(guess.results[boardIndex][colIndex]);
                } else if (isCurrentRow && currentGuess[colIndex]) {
                  content = toTurkishUpperCase(currentGuess[colIndex]);
                }

                return (
                  <div
                    key={colIndex}
                    className={`w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-base font-bold ${squareClass}`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board; 