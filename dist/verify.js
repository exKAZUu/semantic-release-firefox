"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirefoxConditions = ({ env }) => {
    const { FIREFOX_EMAIL, FIREFOX_PASSWORD } = env;
    if (!FIREFOX_EMAIL || !FIREFOX_PASSWORD) {
        throw new Error('Environment variables FIREFOX_EMAIL and FIREFOX_PASSWORD must be set');
    }
};
//# sourceMappingURL=verify.js.map