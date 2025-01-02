import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';

const useKeyboard = () => {
  const { currentGuess, setCurrentGuess, makeGuess, gameWords, gameStatus } = useGame();

  // Türkçe karakter eşleştirmeleri
  const turkishKeyMap = {
    'i': 'i',
    'I': 'ı',
    'İ': 'i',
    'ı': 'ı',
    'Ğ': 'ğ',
    'ğ': 'ğ',
    'Ü': 'ü',
    'ü': 'ü',
    'Ş': 'ş',
    'ş': 'ş',
    'Ö': 'ö',
    'ö': 'ö',
    'Ç': 'ç',
    'ç': 'ç'
  };

  // Kelime listesinde var mı kontrol et
  const isValidWord = useCallback(async (word) => {
    try {
      const response = await fetch('http://localhost:3001/api/words');
      const data = await response.json();
      return data.words.some(w => w.word.toLowerCase() === word.toLowerCase());
    } catch (error) {
      console.error('Kelime kontrolünde hata:', error);
      return false;
    }
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (gameStatus !== 'playing') return;

    const key = event.key.toLowerCase();
    const turkishKey = turkishKeyMap[key] || key;

    if (key === 'enter') {
      makeGuess(currentGuess);
    } else if (key === 'backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zçğıöşü]$/.test(turkishKey) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + turkishKey.toUpperCase());
    }
  }, [currentGuess, makeGuess, gameStatus, turkishKeyMap]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return { handleKeyPress };
};

export default useKeyboard; 