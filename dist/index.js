"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepare_1 = require("./prepare");
const publish_1 = require("./publish");
const verify_1 = require("./verify");
let verifed = false;
let prepared = false;
exports.verifyConditions = async (config, context) => {
    verify_1.verifyFirefoxConditions(context);
    verifed = true;
};
exports.prepare = async (config, { nextRelease: { version }, logger, cwd }) => {
    if (!verifed) {
        throw new Error('verifyConditions was not called. semantic-release-firefox needs to be included in the verifyConditions step');
    }
    await prepare_1.prepareFirefoxExtension(config, { version, cwd, logger });
    prepared = true;
};
exports.publish = async (config, { nextRelease: { notes }, env, logger }) => {
    if (!prepared) {
        throw new Error('prepare was not called. semantic-release-firefox needs to be included in the prepare step');
    }
    return await publish_1.publishFirefoxExtension(config, {
        notes,
        email: env.FIREFOX_EMAIL,
        password: env.FIREFOX_PASSWORD,
        logger,
    });
};
//# sourceMappingURL=index.js.map