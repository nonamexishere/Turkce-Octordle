import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Board from './components/Board/Board';
import Keyboard from './components/Keyboard/Keyboard';
import Stats from './components/Stats/Stats';
import Toast from './components/Toast/Toast';

const Game = () => {
  const { toast, hideToast } = useGame();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <Stats />
                <div className="grid grid-cols-4 gap-2">
                  {Array(8).fill().map((_, index) => (
                    <Board key={index} boardIndex={index} />
                  ))}
                </div>
                <Keyboard />
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default App; 