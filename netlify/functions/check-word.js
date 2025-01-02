exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    const { guess, target } = JSON.parse(event.body);
    
    if (!guess || !target || guess.length !== 5 || target.length !== 5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Geçersiz kelime uzunluğu' })
      };
    }

    const result = new Array(5).fill('wrong');
    const targetChars = target.split('');
    const guessChars = guess.split('');
    
    // Doğru pozisyondaki harfleri kontrol et
    for (let i = 0; i < 5; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = 'correct';
        targetChars[i] = null;
        guessChars[i] = null;
      }
    }
    
    // Yanlış pozisyondaki harfleri kontrol et
    for (let i = 0; i < 5; i++) {
      if (guessChars[i] === null) continue;
      
      const targetIndex = targetChars.indexOf(guessChars[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetChars[targetIndex] = null;
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kelime kontrolünde hata oluştu' })
    };
  }
}; 