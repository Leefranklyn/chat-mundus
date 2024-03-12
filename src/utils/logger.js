import winston from "winston";
import expressWinston from "express-winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "combinedlog.log" })
    ]
});

logger.stream = {
    write: function (message) {
        logger.info(message.trim());
    }
};

export const expressLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: "httplog.log" })
    ],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ all: true })
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false
});

export const expressErrorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({ filename: 'error.log' }),
    ],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize({ all: true })
    ),
})