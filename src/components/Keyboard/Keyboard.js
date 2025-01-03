import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import useKeyboard from '../../hooks/useKeyboard';

const Keyboard = () => {
  const { usedLetters, gameStatus } = useGame();
  const { handleKeyPress } = useKeyboard();

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', '⌫']
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const getKeyStyles = (key) => {
    if (key === 'Enter' || key === '⌫') {
      return ['bg-gray-300 hover:bg-gray-400'];
    }

    const letterStatuses = usedLetters[key.toLowerCase()];
    if (!letterStatuses) {
      return ['bg-gray-300 hover:bg-gray-400'];
    }

    // Her kelime için durumu kontrol et
    const styles = [];
    const statusCount = {
      correct: 0,
      present: 0,
      wrong: 0,
      unused: 0
    };

    letterStatuses.forEach(status => {
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Stil sınıflarını oluştur
    if (statusCount.correct > 0) {
      styles.push(`bg-green-500 flex-grow`);
    }
    if (statusCount.present > 0) {
      styles.push(`bg-yellow-500 flex-grow`);
    }
    if (statusCount.wrong > 0 || statusCount.unused === letterStatuses.length) {
      styles.push(`bg-gray-300 flex-grow`);
    }

    return styles;
  };

  if (gameStatus !== 'playing') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 bg-gray-100">
      <div className="max-w-2xl mx-auto space-y-1.5">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const styles = getKeyStyles(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === '⌫') {
                      handleKeyPress('Backspace');
                    } else {
                      handleKeyPress(key);
                    }
                  }}
                  className={`
                    ${key === 'Enter' ? 'w-16' : key === '⌫' ? 'w-12' : 'w-10'}
                    h-12
                    rounded
                    font-medium
                    text-sm
                    transition-colors
                    shadow-sm
                    active:scale-95
                    focus:outline-none
                    overflow-hidden
                    relative
                  `}
                >
                  <div className="absolute inset-0 flex">
                    {styles.map((style, index) => (
                      <div key={index} className={style} />
                    ))}
                  </div>
                  <span className="relative z-10 text-center w-full block">
                    {key}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard; 