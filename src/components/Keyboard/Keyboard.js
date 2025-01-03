import React from 'react';
import { useGame } from '../../context/GameContext';

const Keyboard = ({ onKeyPress }) => {
  const { gameWords, guesses, solvedBoards, gameStatus } = useGame();

  // Oyun bittiyse klavyeyi gösterme
  if (gameStatus !== 'playing') {
    return null;
  }

  // Türkçe klavye düzeni
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ş', 'i'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç', 'backspace'],
  ];

  // Türkçe karakter dönüşümleri
  const turkishToUpper = {
    'i': 'İ',
    'ı': 'I',
    'ğ': 'Ğ',
    'ü': 'Ü',
    'ş': 'Ş',
    'ö': 'Ö',
    'ç': 'Ç'
  };

  // Her harf için tüm tahminlerdeki en iyi durumunu hesapla
  const getLetterResults = (letter) => {
    if (!guesses.length) return Array(8).fill(null);
    
    // Harf hiç kullanılmamışsa null dön
    const isLetterUsed = guesses.some(guess => 
      guess.word.toLowerCase().includes(letter.toLowerCase())
    );
    if (!isLetterUsed) return Array(8).fill(null);

    const results = Array(8).fill(null);

    // Her tahta için sonucu bul
    for (let i = 0; i < gameWords.length; i++) {
      let bestResult = null;
      // Tüm tahminleri kontrol et
      for (const guess of guesses) {
        if (!guess.results || !guess.results[i]) continue;
        
        const letterPositions = guess.word.toLowerCase().split('').map((l, idx) => l === letter ? idx : -1).filter(idx => idx !== -1);
        if (letterPositions.length > 0) {
          for (const pos of letterPositions) {
            const result = guess.results[i][pos];
            if (result === 'correct') {
              bestResult = 'correct';
              break;
            } else if (result === 'present' && bestResult !== 'correct') {
              bestResult = 'present';
            } else if (result === 'wrong' && !bestResult) {
              bestResult = 'wrong';
            }
          }
        }
      }
      results[i] = bestResult || 'wrong';
    }
    return results;
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'correct': return 'bg-green-500';
      case 'present': return 'bg-yellow-500';
      case 'wrong': return 'bg-gray-500';
      default: return 'bg-transparent';
    }
  };

  // Üstteki tahta göstergeleri
  const BoardIndicators = () => (
    <div className="flex justify-center gap-2 mb-2">
      {Array(8).fill(null).map((_, index) => {
        const isSolved = solvedBoards.has(index);
        return (
          <div
            key={index}
            className={`w-8 h-6 rounded flex items-center justify-center text-sm font-bold text-white ${
              isSolved ? 'bg-gray-400' : 'bg-gray-700'
            }`}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 shadow-lg">
      <div className="max-w-3xl mx-auto">
        <BoardIndicators />
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((key) => {
              if (key === 'enter') {
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress('Enter')}
                    className="keyboard-key bg-gray-700 hover:bg-gray-600 text-white px-6 text-sm font-semibold"
                  >
                    ENTER
                  </button>
                );
              }
              if (key === 'backspace') {
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress('Backspace')}
                    className="keyboard-key bg-gray-700 hover:bg-gray-600 text-white px-6 text-sm font-semibold"
                  >
                    DELETE
                  </button>
                );
              }

              const letterResults = getLetterResults(key);
              const hasResult = letterResults.some(r => r !== null);

              return (
                <div key={key} className="relative">
                  {/* Her harf için tahta göstergeleri */}
                  {hasResult && (
                    <div className="absolute -top-1 left-0 right-0 flex justify-center gap-px">
                      {letterResults.map((result, index) => (
                        result && (
                          <div
                            key={index}
                            className={`w-2 h-2 ${getResultColor(result)}`}
                          />
                        )
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => onKeyPress(key)}
                    className="keyboard-key bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    {turkishToUpper[key] || key.toUpperCase()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard; 