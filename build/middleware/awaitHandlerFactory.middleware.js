"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = awaitHandlerFactory;
//# sourceMappingURL=awaitHandlerFactory.middleware.js.map