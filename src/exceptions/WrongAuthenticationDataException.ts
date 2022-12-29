import HttpException from './HttpException';

class WrongAuthenticationDataException extends HttpException {
    constructor() {
        super(401, 'Wrong user data');
    }
}

export default WrongAuthenticationDataException;