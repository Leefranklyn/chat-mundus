import dotenv from "dotenv"
import path, { resolve } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, "../../.env")});

import { createTransport } from "nodemailer";
const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.BREVO_LOGIN,
        pass: process.env.BREVO_KEY
    },
});

transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    }
    console.log(success)
});

export const sendEmail = (from, to, subject, html) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({from, to, subject, html}, (err, info) => {
            if(err) {
                console.log("mail error", err);
                return reject(err);
            };
            resolve(info)
        });
    });
};