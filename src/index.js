import { configDotenv } from 'dotenv';
configDotenv()
import "./cron/reminder.js"
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { PORT, SERVER_URL } from './constant/index.js';

import routes from './routes/index.js';
import tests from './routes/test.js'

const app = express();

//PARSE APPLICATION JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// ROUTES
app.use('/api', routes);
app.use('/test', tests)

app.get('/', (req, res) => {
  return res.status(200).json({ status: 200, message: "Hello World" });
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server started on port ${PORT} ⚡`);
  console.log(SERVER_URL);
});