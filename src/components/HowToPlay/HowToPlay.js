import React from 'react';

const HowToPlay = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nasıl Oynanır?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p>8 adet OCTORDLE kelimesini 13 denemede bilmeye çalışın.</p>
          <p>Her tahmin 5 harfli geçerli bir kelime olmalıdır. Tahmininizi göndermek için ENTER tuşuna basın.</p>
          
          <div className="mt-6">
            <p className="font-semibold mb-2">Her tahminden sonra karoların rengi değişerek kelimelere ne kadar yakın olduğunuzu gösterir:</p>
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 flex items-center justify-center text-xl font-bold rounded">G</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">A</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">M</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">E</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">S</div>
                <span className="ml-3">G harfi kelimede var ve doğru yerde.</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">P</div>
                <div className="w-10 h-10 bg-yellow-500 flex items-center justify-center text-xl font-bold rounded">İ</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">E</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">C</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">E</div>
                <span className="ml-3">İ harfi kelimede var ama yanlış yerde.</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">G</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">A</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">M</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">E</div>
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-xl font-bold rounded">S</div>
                <span className="ml-3">Bu harfler kelimede yok.</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Puanlama Sistemi:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Her kelime için ilk denemede 20 puan</li>
              <li>Her ek denemede 1 puan azalır</li>
              <li>13. denemede 8 puan</li>
              <li>Bulunamayan kelimeler için 0 puan</li>
              <li>Maksimum puan: 8 kelime × 20 puan = 160 puan</li>
            </ul>
          </div>

          <div className="mt-6">
            <p className="font-semibold">Önemli Bilgiler:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Her gün yeni kelimeler Türkiye saati 03:00'da güncellenir</li>
              <li>Tüm kelimeler Türkçe karakterler içerebilir (Ç, Ğ, İ, Ö, Ş, Ü)</li>
              <li>Her tahmin tüm kelimeler için kontrol edilir</li>
              <li>Kelime anlamlarını görmek için sonuçlardaki 📖 simgesine tıklayabilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay; 