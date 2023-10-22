import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { routes } from './routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

const app = express();
const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
  ],
  credentials:true,
   optionSuccessStatus:200,
};
app.use(cors(corsOpts));
// app.use(bodyParser.json());
app.use(express.static(path.resolve(dirName, '../build')));

const port = process.env.PORT || 3300;

app.use('/api', bodyParser.json(), routes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(dirName, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});