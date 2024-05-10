// import logger from "morgan";
import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDb } from "./src/config/db.js";
import routers from "./src/routes/index.js";
import { logger, expressLogger, expressErrorLogger } from "./src/utils/logger.js";
import { app, server } from "./src/socket/socket.js";

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

server.listen(port, () => {
    console.log(`app listening on {port}: ${port}`)
})