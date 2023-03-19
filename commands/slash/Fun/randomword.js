const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "randomword",
    description: "Generates a random safe word",
    category: "fun",
    run: async (client, message, args) => {
        const wordsApiKey = 'your-words-api-key'; // replace with your WordsAPI API key
        const wordsApiUrl = `https://wordsapiv1.p.rapidapi.com/words/?random=true&hasDetails=definitions&limit=1000`;

        const purgoApiKey = 'your-purgomalum-api-key'; // replace with your PurgoMalum API key
        const purgoApiUrl = `https://www.purgomalum.com/service/containsprofanity?text=`;

        const { data } = await fetch(wordsApiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': wordsApiKey,
                'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
                'useQueryString': true
            }
        }).then(res => res.json());

        const safeWords = data.filter(word => !word.includes('-') && !word.includes(' ')).slice(0, 1000);

        let word = generateRandomWord(safeWords);

        while (await isBadWord(purgoApiKey, purgoApiUrl, word)) {
            word = generateRandomWord(safeWords);
        }

        const embed = new EmbedBuilder()
            .setTitle("Random Word")
            .setDescription(`Your random safe word is **${word}**`)
            .setColor("Green")
            .setTimestamp();

        message.channel.send(embed);
    }
};

async function isBadWord(apiKey, url, word) {
    const response = await fetch(`${url}${encodeURIComponent(word)}`, {
        headers: {
            'api_key': apiKey
        }
    });

    const result = await response.text();
    return result === 'true';
}

function generateRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}
