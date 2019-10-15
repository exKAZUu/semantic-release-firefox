"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const verify_1 = require("../verify");
describe('verifyFirefoxConditions()', () => {
    it('should throw if FIREFOX_EMAIL is not set', () => {
        assert.throws(() => {
            verify_1.verifyFirefoxConditions({ env: { FIREFOX_PASSWORD: 'abc' } });
        });
    });
    it('should throw if FIREFOX_PASSWORD is not set', () => {
        assert.throws(() => {
            verify_1.verifyFirefoxConditions({ env: { FIREFOX_EMAIL: 'test@test.com' } });
        });
    });
});
//# sourceMappingURL=verify.test.js.map