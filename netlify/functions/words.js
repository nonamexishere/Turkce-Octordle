const words = require('../game_words.json');

exports.handler = async function(event, context) {
  try {
    // Günün kelimelerini seç
    const startDate = new Date('2025-01-03').getTime();
    const today = new Date().getTime();
    let dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Negatif gün numaralarını 1'e çevir
    dayNumber = dayNumber < 1 ? 1 : dayNumber;
    
    // Mevcut kelime sayısına göre gün sayısını sınırla
    const maxDays = Math.floor(words.words.length / 8);
    dayNumber = ((dayNumber - 1) % maxDays) + 1;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        words: words.words.slice((dayNumber - 1) * 8, dayNumber * 8),
        dayNumber: dayNumber
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kelimeler yüklenirken hata oluştu' })
    };
  }
}; 