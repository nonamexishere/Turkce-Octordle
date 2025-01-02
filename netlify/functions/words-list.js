const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const dataPath = path.join(__dirname, '../game_words.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        words: data.words
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kelime listesi yüklenirken hata oluştu' })
    };
  }
}; 