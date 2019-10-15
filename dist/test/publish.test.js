"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
// @ts-ignore
const getLogger = require("semantic-release/lib/get-logger");
const publish_1 = require("../publish");
const server_1 = require("./server");
const FIXTURES_DIR = path.resolve(__dirname, '..', '..', 'fixtures');
const PORT = 45032;
describe('publishFirefoxExtension()', () => {
    const email = 'test@test.com';
    const password = 'test123';
    let mockAMO;
    let server;
    const amoBaseUrl = `http://localhost:${PORT}`;
    beforeEach(done => {
        mockAMO = server_1.createMockAMOServer({ email, password });
        server = mockAMO.app.listen(PORT, done);
    });
    afterEach(done => {
        server.close(done);
    });
    it('should release an extension with sources', async () => {
        await publish_1.publishFirefoxExtension({
            addOnSlug: 'testextension',
            xpiPath: path.join(FIXTURES_DIR, 'test.xpi'),
            sourcesArchivePath: path.join(FIXTURES_DIR, 'testsources.zip'),
            notesToReviewer: 'Please dont judge',
        }, {
            notes: 'Lots of exciting changes',
            email,
            password,
            logger: getLogger(process),
            amoBaseUrl,
        });
        assert.deepStrictEqual(mockAMO.extensionVersionUploads, [
            {
                slug: 'testextension',
                versionId: 0,
                sourcesFileName: 'testsources.zip',
                hasSources: true,
                releaseNotes: 'Lots of exciting changes',
                notesToReviewer: 'Please dont judge',
            },
        ]);
    });
    it('should release an extension without sources', async () => {
        await publish_1.publishFirefoxExtension({
            addOnSlug: 'testextension',
            xpiPath: path.join(FIXTURES_DIR, 'test.xpi'),
            sourcesArchivePath: null,
            notesToReviewer: 'Please dont judge',
        }, {
            notes: 'Lots of exciting changes',
            email,
            password,
            logger: getLogger(process),
            amoBaseUrl,
        });
        assert.deepStrictEqual(mockAMO.extensionVersionUploads, [
            {
                slug: 'testextension',
                versionId: 0,
                hasSources: false,
                releaseNotes: 'Lots of exciting changes',
                notesToReviewer: 'Please dont judge',
            },
        ]);
    });
});
//# sourceMappingURL=publish.test.js.map