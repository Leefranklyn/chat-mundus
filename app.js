import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDb } from "./src/config/db.js";
// import logger from "morgan";
import routers from "./src/routes/index.js";
import { logger, expressLogger, expressErrorLogger } from "./src/utils/logger.js";

const app = express();
connectToDb();
app.use(expressLogger);
app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

routers(app);
app.use(expressErrorLogger);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`app listening on {port}: ${port}`)
})