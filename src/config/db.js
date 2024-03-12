import { connect } from "mongoose"

export const connectToDb = async () => {
    try {
        const dbConnection = await connect(process.env.MONGODB_URL);

        if (process.env.NODE_ENV === "development") {
            return console.log(`Dev db connected @ ${dbConnection.connection.host}`);
        };
        console.log(`Production db connected @ ${dbConnection.connection.host}`);
    } catch (error) {
        console.log("Db connection failed");
        process.exit(1);
    }
}