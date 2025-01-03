import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Oyun durumunu localStorage'dan yükle
  const loadGameState = () => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const state = JSON.parse(savedState);
        // Eğer kaydedilen oyun bugüne aitse, durumu geri yükle
        if (state.date === new Date().toDateString()) {
          return state;
        }
      }
    } catch (error) {
      console.error('Oyun durumu yüklenirken hata:', error);
    }
    return null;
  };

  // İstatistikleri localStorage'dan yükle
  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem('gameStats');
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      averageGuesses: 0,
      totalGuesses: 0,
      totalScore: 0,
      averageScore: 0,
      lastPlayedDate: null
    };
  };

  const [gameWords, setGameWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [usedLetters, setUsedLetters] = useState({});
  const maxGuesses = 13;
  const [solvedBoards, setSolvedBoards] = useState(new Set());
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [dayNumber, setDayNumber] = useState(1);
  const [stats, setStats] = useState(loadStats);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Oyun durumunu kaydet
  const saveGameState = () => {
    try {
      const state = {
        guesses,
        gameStatus,
        usedLetters,
        solvedBoards: Array.from(solvedBoards),
        score,
        date: new Date().toDateString()
      };
      localStorage.setItem('gameState', JSON.stringify(state));
    } catch (error) {
      console.error('Oyun durumu kaydedilirken hata:', error);
    }
  };

  // İstatistikleri güncelle ve kaydet
  const updateStats = (won) => {
    const today = new Date().toDateString();
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
      totalGuesses: stats.totalGuesses + guesses.length,
      averageGuesses: Math.round((stats.totalGuesses + guesses.length) / (stats.gamesPlayed + 1) * 10) / 10,
      totalScore: stats.totalScore + score,
      averageScore: Math.round(((stats.totalScore + score) / (stats.gamesPlayed + 1)) * 10) / 10,
      lastPlayedDate: today
    };
    setStats(newStats);
    localStorage.setItem('gameStats', JSON.stringify(newStats));
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchGameWords(), fetchWordList()]);
      
      // Kaydedilmiş oyun durumunu yükle
      const savedState = loadGameState();
      if (savedState) {
        setGuesses(savedState.guesses);
        setGameStatus(savedState.gameStatus);
        setUsedLetters(savedState.usedLetters);
        setSolvedBoards(new Set(savedState.solvedBoards));
        setScore(savedState.score);
      }
      
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Oyun durumu değiştiğinde kaydet
  useEffect(() => {
    if (!isLoading) {
      saveGameState();
    }
  }, [guesses, gameStatus, usedLetters, solvedBoards, score, isLoading, saveGameState]);

  const fetchGameWords = async () => {
    try {
      const response = await fetch('/.netlify/functions/words');
      const data = await response.json();
      setGameWords(data.words);
      setDayNumber(data.dayNumber);
    } catch (error) {
      console.error('Kelimeler yüklenirken hata:', error);
    }
  };

  const fetchWordList = async () => {
    try {
      const response = await fetch('/.netlify/functions/words-list');
      const data = await response.json();
      console.log('Loaded word list:', data);
      setWordList(data.words);
    } catch (error) {
      console.error('Kelime listesi yüklenirken hata:', error);
    }
  };

  const normalizeWord = (word) => {
    const charMap = {
      'i': 'İ',
      'I': 'I',
      'İ': 'İ',
      'ı': 'I',
      'Ğ': 'Ğ', 'ğ': 'Ğ',
      'Ü': 'Ü', 'ü': 'Ü',
      'Ş': 'Ş', 'ş': 'Ş',
      'Ö': 'Ö', 'ö': 'Ö',
      'Ç': 'Ç', 'ç': 'Ç'
    };
    return word.split('').map(char => charMap[char] || char.toUpperCase()).join('');
  };

  const isValidWord = (guess) => {
    if (isLoading || !wordList.length) {
      console.log('Word list is still loading...');
      return true;
    }
    
    const normalizedGuess = normalizeWord(guess);
    return wordList.some(w => normalizeWord(w.word) === normalizedGuess);
  };

  const checkGuess = async (guess, targetWord) => {
    try {
      const response = await fetch('/.netlify/functions/check-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          guess: normalizeWord(guess), 
          target: normalizeWord(targetWord)
        }),
      });

      if (!response.ok) {
        throw new Error('Kelime kontrolü başarısız oldu');
      }

      const data = await response.json();
      if (!data.result || !Array.isArray(data.result)) {
        throw new Error('Geçersiz sunucu yanıtı');
      }

      return data.result;
    } catch (error) {
      console.error('Tahmin kontrolünde hata:', error);
      return Array(5).fill('wrong');
    }
  };

  const updateLetterStatuses = (guess, wordIndex, result) => {
    setUsedLetters(prev => {
      const newStatuses = { ...prev };
      
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].toLowerCase();
        if (!newStatuses[letter]) {
          newStatuses[letter] = Array(8).fill('unused');
        }
        
        if (result[i] === 'correct') {
          newStatuses[letter][wordIndex] = 'correct';
        } else if (result[i] === 'present' && newStatuses[letter][wordIndex] !== 'correct') {
          newStatuses[letter][wordIndex] = 'present';
        } else if (result[i] === 'wrong' && newStatuses[letter][wordIndex] !== 'correct' && newStatuses[letter][wordIndex] !== 'present') {
          newStatuses[letter][wordIndex] = 'wrong';
        }
      }
      
      return newStatuses;
    });
  };

  const calculateScore = (newGuesses, newSolvedBoards) => {
    let totalScore = 0;
    newSolvedBoards.forEach(boardIndex => {
      const guessNumber = newGuesses.findIndex(g => 
        g.results[boardIndex].every(r => r === 'correct')
      ) + 1;
      
      // İlk denemede 20 puan, her deneme için 1 puan azalır
      // 13. denemede 8 puan, bulunamazsa 0 puan
      const points = Math.max(21 - guessNumber, 0);
      totalScore += points;
    });
    return totalScore;
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'error' });
  };

  const makeGuess = async (guess) => {
    if (gameStatus !== 'playing' || guess.length !== 5) return;

    try {
      if (!isValidWord(guess)) {
        showToast('Bu kelime listede yok!');
        return;
      }

      const results = await Promise.all(
        gameWords.map(word => checkGuess(guess, word.word))
      );

      const newGuesses = [...guesses, { word: guess, results }];
      setGuesses(newGuesses);

      updateLetterStatuses(guess, 0, results[0]);

      const newSolvedBoards = new Set(solvedBoards);
      results.forEach((result, index) => {
        if (result.every(r => r === 'correct')) {
          newSolvedBoards.add(index);
        }
      });
      setSolvedBoards(newSolvedBoards);

      if (newSolvedBoards.size === 8 || newGuesses.length >= maxGuesses) {
        const won = newSolvedBoards.size === 8;
        const finalScore = calculateScore(newGuesses, newSolvedBoards);
        setScore(finalScore);
        setGameStatus(won ? 'won' : 'lost');
        updateStats(won);
      }

      setCurrentGuess('');
    } catch (error) {
      console.error('Tahmin yapılırken hata oluştu:', error);
      showToast('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  const getBoardStatus = (boardIndex) => {
    if (solvedBoards.has(boardIndex)) {
      return guesses.findIndex(g => 
        g.results[boardIndex].every(r => r === 'correct')
      ) + 1;
    }
    return null;
  };

  const value = {
    gameWords,
    guesses,
    currentGuess,
    setCurrentGuess,
    gameStatus,
    usedLetters,
    maxGuesses,
    makeGuess,
    getBoardStatus,
    solvedBoards,
    score,
    dayNumber,
    stats,
    toast,
    hideToast
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext; 