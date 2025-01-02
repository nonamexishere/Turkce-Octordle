import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';

const useKeyboard = () => {
  const { currentGuess, setCurrentGuess, makeGuess, gameStatus } = useGame();

  // Türkçe karakter eşleştirmeleri
  const turkishKeyMap = {
    'i': 'İ',
    'I': 'I',
    'İ': 'İ',
    'ı': 'I',
    'Ğ': 'Ğ',
    'ğ': 'Ğ',
    'Ü': 'Ü',
    'ü': 'Ü',
    'Ş': 'Ş',
    'ş': 'Ş',
    'Ö': 'Ö',
    'ö': 'Ö',
    'Ç': 'Ç',
    'ç': 'Ç'
  };

  const handleKeyPress = useCallback((event) => {
    if (gameStatus !== 'playing') return;

    const key = event.key.toLowerCase();
    const turkishKey = turkishKeyMap[key] || key;

    if (key === 'enter') {
      makeGuess(currentGuess);
    } else if (key === 'backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zçğıiöşü]$/.test(key) && currentGuess.length < 5) {
      const mappedKey = turkishKeyMap[key] || key.toUpperCase();
      setCurrentGuess(prev => prev + mappedKey);
    }
  }, [currentGuess, makeGuess, gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { handleKeyPress };
};

export default useKeyboard; 