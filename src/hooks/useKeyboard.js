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

  const handleKeyInput = useCallback((key) => {
    if (gameStatus !== 'playing') return;

    const lowerKey = key.toLowerCase();
    
    if (lowerKey === 'enter') {
      makeGuess(currentGuess);
    } else if (lowerKey === 'backspace' || lowerKey === '←') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zçğıiöşü]$/.test(lowerKey) && currentGuess.length < 5) {
      const mappedKey = turkishKeyMap[lowerKey] || lowerKey.toUpperCase();
      setCurrentGuess(prev => prev + mappedKey);
    }
  }, [currentGuess, makeGuess, gameStatus]);

  const handleKeyPress = useCallback((event) => {
    handleKeyInput(event.key);
  }, [handleKeyInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { handleKeyPress: handleKeyInput };
};

export default useKeyboard; 