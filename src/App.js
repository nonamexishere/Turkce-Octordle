import React, { useState } from 'react';
import Board from './components/Board/Board';
import Keyboard from './components/Keyboard/Keyboard';
import useKeyboard from './hooks/useKeyboard';
import { useGame } from './context/GameContext';
import Stats from './components/Stats/Stats';
import Toast from './components/Toast/Toast';
import HowToPlay from './components/HowToPlay/HowToPlay';

function App() {
  const { gameStatus, toast, hideToast } = useGame();
  const { handleKeyPress } = useKeyboard();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Türkçe Octordle</h1>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold"
          >
            Nasıl Oynanır?
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(null).map((_, index) => (
            <Board key={index} boardIndex={index} />
          ))}
        </div>
        {gameStatus === 'playing' && <Keyboard onKeyPress={handleKeyPress} />}
        {gameStatus !== 'playing' && <Stats />}
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      </main>
    </div>
  );
}

export default App; 