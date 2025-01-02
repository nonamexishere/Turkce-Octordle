import { useCallback } from 'react';
import { useGame } from '../context/GameContext';

const useKeyboard = () => {
  const { makeGuess, currentGuess, setCurrentGuess, gameStatus } = useGame();

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

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return;

    // Enter tuşu kontrolü
    if (key === 'Enter') {
      if (currentGuess.length === 5) {
        makeGuess(currentGuess);
      }
      return;
    }

    // Backspace tuşu kontrolü
    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    // Normal karakter kontrolü
    if (currentGuess.length < 5) {
      // Türkçe karakter dönüşümü
      const normalizedKey = turkishKeyMap[key] || key.toLowerCase();
      
      // Sadece harf karakterlerini kabul et
      if (/^[a-zçğıöşüi]$/i.test(normalizedKey)) {
        setCurrentGuess(prev => prev + normalizedKey);
      }
    }
  }, [currentGuess, gameStatus, makeGuess, setCurrentGuess]);

  return { handleKeyPress };
};

export default useKeyboard; 