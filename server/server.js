const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Kelime listesini yükle
async function loadWords() {
    try {
        const data = await fs.readFile(path.join(__dirname, '../public/data/game_words.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Kelimeler yüklenirken hata oluştu:', error);
        return { words: [] };
    }
}

// Kelimeleri zorluk seviyesine göre sırala
function sortWordsByDifficulty(words) {
    return words.sort((a, b) => {
        // Önce zorluk seviyesine göre sırala
        if (a.difficulty !== b.difficulty) {
            return a.difficulty - b.difficulty;
        }
        // Zorluk seviyeleri aynıysa alfabetik sırala
        return a.word.localeCompare(b.word);
    });
}

// Günün kelimelerini seç
function getDailyWords(words, customDate = null) {
    // GMT+3'e göre gün hesapla
    const now = customDate || new Date();
    const utcDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const turkeyDate = new Date(utcDate.getTime() + (3 * 60 * 60000));
    
    // Bugünden başlayarak gün sayısını hesapla
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNumber = Math.floor((turkeyDate - today) / (1000 * 60 * 60 * 24)) + 1;

    // Kelimeleri baş harflerine göre grupla
    const wordsByFirstLetter = {};
    words.forEach(word => {
        const firstLetter = word.word.charAt(0).toLowerCase();
        if (!wordsByFirstLetter[firstLetter]) {
            wordsByFirstLetter[firstLetter] = [];
        }
        wordsByFirstLetter[firstLetter].push(word);
    });

    // Her gruptan en fazla 2 kelime seçerek 8 kelime oluştur
    const selectedWords = [];
    const letters = Object.keys(wordsByFirstLetter).sort();
    
    // Her harften kaç kelime seçileceğini belirle
    const wordsPerLetter = {};
    let remainingWords = 8;
    let remainingLetters = letters.length;

    letters.forEach(letter => {
        const maxFromThisLetter = Math.min(2, wordsByFirstLetter[letter].length);
        const wordsToTake = Math.min(maxFromThisLetter, Math.ceil(remainingWords / remainingLetters));
        wordsPerLetter[letter] = wordsToTake;
        remainingWords -= wordsToTake;
        remainingLetters--;
    });

    // Her harften belirlenen sayıda kelime seç
    letters.forEach((letter, letterIndex) => {
        const letterWords = [...wordsByFirstLetter[letter]]; // Kopya oluştur
        const count = wordsPerLetter[letter];
        
        // Bu harfle başlayan kelimeleri karıştır
        for (let i = letterWords.length - 1; i > 0; i--) {
            const seed = (dayNumber * letterIndex * 31 + i) % letterWords.length;
            const j = seed % (i + 1);
            [letterWords[i], letterWords[j]] = [letterWords[j], letterWords[i]];
        }
        
        // Belirlenen sayıda kelime seç
        for (let i = 0; i < count && selectedWords.length < 8; i++) {
            const index = (dayNumber * (i + 1) + letterIndex) % letterWords.length;
            selectedWords.push(letterWords[index]);
        }
    });

    // Eğer 8 kelime tamamlanmadıysa, kalan kelimeleri rastgele seç
    if (selectedWords.length < 8) {
        const remainingWordPool = words.filter(w => !selectedWords.includes(w));
        while (selectedWords.length < 8 && remainingWordPool.length > 0) {
            const index = (dayNumber * selectedWords.length * 31) % remainingWordPool.length;
            selectedWords.push(remainingWordPool[index]);
            remainingWordPool.splice(index, 1);
        }
    }

    // Son bir karıştırma yap
    for (let i = selectedWords.length - 1; i > 0; i--) {
        const seed = (dayNumber * (i + 1) * 31) % selectedWords.length;
        const j = seed % (i + 1);
        [selectedWords[i], selectedWords[j]] = [selectedWords[j], selectedWords[i]];
    }

    return {
        words: selectedWords,
        dayNumber: dayNumber
    };
}

// Tüm kelimeleri getir
app.get('/api/words', async (req, res) => {
    try {
        const wordData = await loadWords();
        res.json(wordData);
    } catch (error) {
        res.status(500).json({ error: 'Kelimeler yüklenirken bir hata oluştu' });
    }
});

// Günün kelimelerini getir
app.get('/api/game/words', async (req, res) => {
    try {
        const wordData = await loadWords();
        const gameWords = getDailyWords(wordData.words);
        res.json(gameWords);
    } catch (error) {
        res.status(500).json({ error: 'Oyun kelimeleri seçilirken bir hata oluştu' });
    }
});

// Kelime kontrolü
app.post('/api/check-word', async (req, res) => {
    try {
        const { guess, target } = req.body;
        if (!guess || !target) {
            return res.status(400).json({ error: 'Tahmin ve hedef kelime gerekli' });
        }

        const result = Array(5).fill('wrong'); // 'wrong', 'correct', 'present'
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

        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Kelime kontrolü sırasında bir hata oluştu' });
    }
});

// Test endpoint'i - belirli bir gün için kelimeleri getir
app.get('/api/test/words/:dayOffset', async (req, res) => {
    try {
        const dayOffset = parseInt(req.params.dayOffset) || 0;
        const wordData = await loadWords();
        
        // Test için tarihi simüle et
        const testDate = new Date();
        testDate.setDate(testDate.getDate() + dayOffset);
        testDate.setHours(0, 0, 0, 0);
        
        // Kelimeleri al
        const gameWords = getDailyWords(wordData.words, testDate);
        
        res.json({
            date: testDate.toISOString(),
            dayNumber: dayOffset + 1,
            words: gameWords.words.map(w => ({
                word: w.word,
                firstLetter: w.word.charAt(0)
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Test kelimeleri seçilirken bir hata oluştu' });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 