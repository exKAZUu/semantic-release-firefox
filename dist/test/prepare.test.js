"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const decompress = require("decompress");
const fs_1 = require("mz/fs");
const os = require("os");
const path = require("path");
const rmfr = require("rmfr");
// @ts-ignore
const getLogger = require("semantic-release/lib/get-logger");
const prepare_1 = require("../prepare");
const FIXTURES_DIR = path.resolve(__dirname, '..', '..', 'fixtures');
describe('prepareFirefoxExtension()', () => {
    let tmpDir;
    beforeEach(async () => {
        tmpDir = await fs_1.mkdtemp(path.join(os.tmpdir(), 'semantic-release-firefox-test-'), 'utf-8');
    });
    afterEach(async () => {
        await rmfr(tmpDir);
    });
    it('should prepare files needed for submitting an extension', async () => {
        const xpiPath = path.join(tmpDir, 'test.xpi');
        const sourcesArchivePath = path.join(tmpDir, 'testsources.zip');
        const distFolder = path.join(FIXTURES_DIR, 'extension', 'dist');
        await prepare_1.prepareFirefoxExtension({
            distFolder,
            xpiPath,
            sourcesArchivePath,
        }, {
            version: '1.2.3',
            logger: getLogger(process),
            cwd: path.join(FIXTURES_DIR, 'extension'),
        });
        assert.deepStrictEqual(JSON.parse(await fs_1.readFile(path.join(distFolder, 'manifest.json'), 'utf-8')), {
            name: 'Test',
            version: '1.2.3',
        });
        assert(await fs_1.exists(xpiPath), `Expected ${xpiPath} to exist`);
        const xpiContents = await decompress(xpiPath);
        assert.deepEqual(new Set(xpiContents.map(entry => entry.path)), new Set(['manifest.json', 'bundle.js']));
        assert(await fs_1.exists(sourcesArchivePath), `Expected ${sourcesArchivePath} to exist`);
        const sourcesContents = await decompress(sourcesArchivePath);
        assert.deepEqual(new Set(sourcesContents.map(entry => entry.path)), new Set(['README.md', 'src/', 'src/script.js']));
    });
});
//# sourceMappingURL=prepare.test.js.map