const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8080;

const MONGO_DB_URL = process.env.MONGO_DB_URL || '';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

export { 
    API_PORT,
    MONGO_DB_URL,
    JWT_SECRET
};