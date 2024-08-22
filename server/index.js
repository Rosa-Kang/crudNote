import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'

/** COFIGURATION */ 
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/** JWT setup */ 
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let secretKey = process.env.JWT_SECRET;

if(!secretKey) {
    secretKey = crypto.randomBytes(64).toString('hex');

    const envFilePath = path.join(__dirname, '.env');
    fs.appendFileSync(envFilePath, `\nJWT_SECRET=${secretKey}\n`);
    console.log("Generated new JWT secret key and saved to .env file.")
}

/** ROUTES */

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL, {}).then(()=> {
    app.listen(PORT, () => console.log(`Server Running on Port:  ${PORT} !!`))
}).catch((error) => console.log(`${error} did not connect`))