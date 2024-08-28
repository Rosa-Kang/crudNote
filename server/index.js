import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
    
/** CONFIGURATION */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/** ROUTES */
import noteRoutes from './routes/notes.js';
import userRoutes from "./routes/users.js";

app.use('/notes', noteRoutes);
app.use('/user', userRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to 2025-MERN API!');
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, {})
    .then(() => {
        app.listen(PORT, () => console.log(`MongoDB Server Running on Port: ${PORT} !!`));
    })
    .catch((error) => console.log(`${error} did not connect`));
