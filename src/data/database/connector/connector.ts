import mongoose, { Connection } from "mongoose";

class Connector {
    #url: string;
    #connection: Connection;

    constructor(url: string) {
        this.#url = url;
        this.#connection = mongoose.connection;
    }

    public connectToDB() {
        mongoose.connect(this.#url);
        this.#initDbListeners();
    }

    #initDbListeners() {
        this.#connection.on('connected', () => {
            console.log('MongoDB successfully connected');
        });

        this.#connection.on('error', (error: Error) => {
            console.log(error);
        });

        this.#connection.on('disconnected', () => {
            console.log('MongoDB connection is disconnected');
        });

        process.on('SIGINT', () => {
            mongoose.connection.close();
            console.log('MongoDB connection disconnected through app termination');
            process.exit(0);
        });
    }
}

export default Connector;