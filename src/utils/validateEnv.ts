import {
    cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        SECRET_JWT: str(),
        HOST: str(),
        DB_USER: str(),
        DB_PASS: str(),
        DB_DATABASE: str(),
        PORT: port(),
    });
}

export default validateEnv;