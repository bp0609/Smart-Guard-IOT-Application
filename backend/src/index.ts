import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/acad_blocks', (req, res) => {
  res.json(['AB 1', 'AB 2', 'AB 3']);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
