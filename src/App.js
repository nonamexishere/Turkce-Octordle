import React from 'react';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/GameContext';
import Board from './components/Board/Board';
import Keyboard from './components/Keyboard/Keyboard';
import Stats from './components/Stats/Stats';
import useKeyboard from './hooks/useKeyboard';
import './App.css';

function GameProgress() {
  const { guesses, maxGuesses, solvedBoards } = useGame();
  const progress = (guesses.length / maxGuesses) * 100;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
        {guesses.length}/{maxGuesses} Deneme
        {solvedBoards.size > 0 && ` • ${solvedBoards.size}/8 Kelime`}
      </div>
    </div>
  );
}

function GameBoards() {
  const { gameWords, gameStatus, usedLetters, dayNumber } = useGame();
  const { handleKeyPress } = useKeyboard();

  // 2x2x2x2 grid için tahtaları grupla
  const boardGroups = [];
  for (let i = 0; i < gameWords.length; i += 2) {
    boardGroups.push(gameWords.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Türkçe Octordle
            </h1>
            <span className="text-sm font-medium text-gray-500">
              Gün #{dayNumber}
            </span>
          </div>
          <GameProgress />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-2 py-4 pb-72">
        {/* Game Status */}
        {gameStatus !== 'playing' && (
          <div className="mb-4">
            <div className={`p-4 rounded-lg text-center text-white font-bold mb-4 ${
              gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {gameStatus === 'won' 
                ? 'Tebrikler! Tüm kelimeleri buldunuz!' 
                : 'Oyun bitti! Bazı kelimeleri bulamadınız.'}
            </div>
            <Stats />
          </div>
        )}

        {/* Game Boards - 2x2x2x2 Grid */}
        <div className="space-y-4">
          {boardGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-2 gap-2">
              {group.map((word) => (
                <Board
                  key={word.id}
                  word={word}
                  boardIndex={gameWords.findIndex(w => w.id === word.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Keyboard */}
      <Keyboard onKeyPress={handleKeyPress} usedLetters={usedLetters} />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameBoards />
    </GameProvider>
  );
}

export default App; 