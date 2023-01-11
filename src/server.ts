// import enviroment variables using dotenv
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// imports
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import connectToDb from './utils/connectToDb';

// creating an express app
const app: Application = express();
const PORT = process.env.PORT || 3500;

// credentials

// cors - Cross Origin Resource sharing
app.use(cors(corsOptions));

// Middleware

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// 404
app.all('*', (req: Request, res: Response) => {
  res.sendStatus(404);
});

// error handling

// listening
app.listen(PORT, async () => {
  console.log(`app listening on port ${PORT}`);

  await connectToDb();
});
