const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
  try {
    const { word } = event.queryStringParameters;
    if (!word) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Kelime parametresi gerekli' })
      };
    }

    const response = await fetch(`https://sozluk.gov.tr/gts?ara=${encodeURIComponent(word)}`);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('TDK API hatası:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'TDK API hatası' })
    };
  }
}; 