import React from 'react';
import { useGame } from '../../context/GameContext';

const Keyboard = () => {
  const { usedLetters, makeGuess, currentGuess, setCurrentGuess, gameStatus } = useGame();

  const keyboardLayout = [
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', '⌫']
  ];

  const handleKeyClick = (key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        makeGuess(currentGuess);
      }
    } else if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toLowerCase());
    }
  };

  const getKeyStyle = (key) => {
    if (key === 'ENTER' || key === '⌫') {
      return 'bg-gray-600 text-white hover:bg-gray-700';
    }

    const status = usedLetters[key.toLowerCase()];
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'present':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'wrong':
        return 'bg-gray-800 text-white hover:bg-gray-900';
      default:
        return 'bg-gray-400 text-white hover:bg-gray-500';
    }
  };

  if (gameStatus !== 'playing') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                className={`
                  ${getKeyStyle(key)}
                  ${key === 'ENTER' ? 'w-20' : key === '⌫' ? 'w-16' : 'w-12'}
                  h-14
                  rounded-lg
                  font-bold
                  text-lg
                  transition-colors
                  shadow-md
                  active:scale-95
                  focus:outline-none
                `}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard; 