const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dataPath = path.join(__dirname, '../../public/data/game_words.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Günün kelimelerini seç
    const startDate = new Date('2024-03-20').getTime();
    const today = new Date().getTime();
    const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        words: data.words.slice((dayNumber - 1) * 8, dayNumber * 8),
        dayNumber: dayNumber
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kelimeler yüklenirken hata oluştu' })
    };
  }
}; 