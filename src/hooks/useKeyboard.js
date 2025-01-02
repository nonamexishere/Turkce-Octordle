import { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';

const useKeyboard = () => {
  const { currentGuess, setCurrentGuess, makeGuess, gameWords } = useGame();

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

  const handleKeyPress = useCallback(async (key) => {
    if (key === 'Enter' && currentGuess.length === 5) {
      // Kelime kontrolü yap
      const isValid = await isValidWord(currentGuess);
      if (isValid) {
        makeGuess(currentGuess);
      } else {
        // Geçersiz kelime uyarısı göster
        alert('Bu kelime listede yok!');
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      // Türkçe karakter kontrolü ve dönüşümü
      const normalizedKey = key.toLowerCase();
      const mappedKey = turkishKeyMap[key] || normalizedKey;
      
      // Sadece geçerli Türkçe karakterleri kabul et
      if (/^[a-zçğıöşü]$/.test(mappedKey)) {
        setCurrentGuess(prev => prev + mappedKey);
      }
    }
  }, [currentGuess, makeGuess, setCurrentGuess, isValidWord]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return { handleKeyPress };
};

export default useKeyboard; 