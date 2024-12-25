import 'dotenv/config';

export const envVariables = {
    PORT: process.env.PORT || 3000,
    ORIGIN: process.env.ORIGIN || 'http://localhost:3000',
}