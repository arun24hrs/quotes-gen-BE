const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();
app.use(cors({origin: 'https://quotes-generator-tau.vercel.app'}));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/quotes', async (req, res) => {
  try {
    const { input } = req.body;
    const quote = await generateQuote(input);
    res.json({ quote });
  } catch (error) {
    console.error('Quote generation failed:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

async function generateQuote(input) {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: input }],
    });

    return chatCompletion.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API request failed:', error);
    throw error;
  }
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
