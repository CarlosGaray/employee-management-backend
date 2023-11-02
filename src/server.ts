import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectToDataBase } from './database';
import { employeeRouter } from './employee.routes';

dotenv.config();

const { ATLAS_URI } = process.env;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

if(!ATLAS_URI) {
    console.log("No ATLAS_URI enviroment variable has been declared on .env");
    process.exit(1);
}

connectToDataBase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors());
        app.use("/employees", employeeRouter);


        app.listen(PORT, () => {
            console.log(`Server running at ${BASE_URL}`)
        })
    })
    .catch(error => console.error(error));