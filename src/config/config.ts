const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;

const MONGO_DB_URL = process.env.MONGO_DB_URL || '';

export { 
    API_PORT,
    MONGO_DB_URL 
};