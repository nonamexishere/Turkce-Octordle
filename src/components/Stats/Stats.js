import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';

const WordMeaningModal = ({ word, onClose }) => {
  const [meanings, setMeanings] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`https://sozluk.gov.tr/gts?ara=${word}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMeanings(data[0].anlamlarListe || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('TDK API hatası:', err);
        setLoading(false);
      });
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{word.toUpperCase()}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {loading ? (
          <div className="text-center py-4">Yükleniyor...</div>
        ) : meanings.length > 0 ? (
          <div className="space-y-3">
            {meanings.map((meaning, index) => (
              <div key={meaning.anlam_id} className="border-b pb-2 last:border-b-0">
                <div className="flex gap-2">
                  <span className="text-gray-500">{index + 1}.</span>
                  <div>
                    {meaning.ozelliklerListe?.map(ozellik => (
                      <span key={ozellik.ozellik_id} className="text-sm text-gray-500 mr-1">
                        {ozellik.tam_adi}
                      </span>
                    ))}
                    <p className="text-gray-900">{meaning.anlam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Anlam bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

const Stats = () => {
  const { stats, guesses, solvedBoards, dayNumber, gameStatus, score, gameWords } = useGame();
  const [selectedWord, setSelectedWord] = useState(null);

  const generateShareText = () => {
    const boardResults = Array(8).fill().map((_, index) => {
      if (solvedBoards.has(index)) {
        const guessNumber = guesses.findIndex(g => 
          g.results[index].every(r => r === 'correct')
        ) + 1;
        return `${guessNumber}/13`;
      }
      return 'X/13';
    });

    const shareText = `Türkçe Octordle #${dayNumber}\n\n${boardResults.join('\n')}\n\nPuan: ${score}/132\n\nhttps://stalwart-babka-3f72e9.netlify.app/`;
    return shareText;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Türkçe Octordle',
        text: generateShareText()
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(generateShareText())
        .then(() => alert('Sonuçlar panoya kopyalandı!'))
        .catch(() => alert('Kopyalama başarısız oldu.'));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">İstatistikler</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</div>
          <div className="text-sm text-gray-600">Oyun</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Kazanma</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
          <div className="text-sm text-gray-600">Seri</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.maxStreak}</div>
          <div className="text-sm text-gray-600">En İyi Seri</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{guesses.length}</div>
          <div className="text-sm text-gray-600">Deneme</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{score}</div>
          <div className="text-sm text-gray-600">Puan</div>
        </div>
      </div>

      {gameStatus !== 'playing' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bugünkü Sonuçlar</h3>
          <div className="bg-gray-100 p-3 rounded-lg mb-4 font-mono text-sm">
            {Array(8).fill().map((_, index) => (
              <div key={index} className="flex flex-col mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Tahta {index + 1}:</span>
                    {gameStatus !== 'playing' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedWord(gameWords[index].word)}
                          className={`font-bold hover:text-blue-600 ${
                            solvedBoards.has(index) ? 'text-gray-800' : 'text-gray-500'
                          }`}
                        >
                          {gameWords[index].word.toUpperCase()}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="font-bold">
                    {solvedBoards.has(index) 
                      ? `${guesses.findIndex(g => g.results[index].every(r => r === 'correct')) + 1}/13`
                      : 'X/13'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleShare}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sonuçları Paylaş
          </button>
        </div>
      )}

      {selectedWord && (
        <WordMeaningModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
};

export default Stats; 