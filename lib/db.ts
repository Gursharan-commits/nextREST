import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error("Please define the MONGOD_URI environment variable inside .env.local");
}

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("connecting.....");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: 'next14restapi',
            bufferCommands: true,

        });
        console.log("connected")
    } catch (err: any) {
        console.log("Error: ", err)
        throw new Error("Error: " + err.message);
    }
};

export default connect;

