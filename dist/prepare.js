"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs_1 = require("fs");
const fs_2 = require("mz/fs");
const path = require("path");
const prettyBytes = require("pretty-bytes");
const config_1 = require("./config");
exports.prepareFirefoxExtension = async ({ xpiPath, distFolder, manifestPath = path.join(distFolder, 'manifest.json'), sourcesArchivePath = config_1.DEFAULT_SOURCES_ARCHIVE_PATH, sourcesGlob = '**', sourcesGlobOptions = {}, }, { version, logger, cwd }) => {
    manifestPath = path.resolve(cwd, manifestPath);
    sourcesArchivePath = sourcesArchivePath && path.resolve(cwd, sourcesArchivePath);
    xpiPath = path.resolve(cwd, xpiPath);
    // Write version to manifest
    const manifest = JSON.parse(await fs_2.readFile(manifestPath, 'utf-8'));
    manifest.version = version;
    await fs_2.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    logger.success(`Wrote version ${version} to ${manifestPath}`);
    // Create .xpi
    logger.log(`Writing xpi archive to ${xpiPath}`);
    await new Promise((resolve, reject) => {
        const out = fs_1.createWriteStream(xpiPath);
        const archive = archiver('zip', {
            zlib: { level: 9 },
        });
        archive.on('error', reject);
        /* istanbul ignore next */
        archive.on('warning', warning => logger.log(warning));
        archive.on('end', () => {
            const totalBytes = prettyBytes(archive.pointer());
            logger.success(`Size: ${totalBytes}`);
            resolve();
        });
        archive.pipe(out);
        archive.directory(distFolder, false);
        archive.finalize();
    });
    // zip sources
    if (!sourcesArchivePath) {
        logger.log('Skipping creation of sources archive per configuration');
    }
    else {
        logger.log(`Writing sources archive to ${sourcesArchivePath}`);
        await new Promise((resolve, reject) => {
            const out = fs_1.createWriteStream(sourcesArchivePath);
            const archive = archiver('zip', {
                zlib: { level: 9 },
            });
            archive.on('error', reject);
            /* istanbul ignore next */
            archive.on('warning', warning => logger.log(warning));
            archive.on('end', () => {
                const totalBytes = prettyBytes(archive.pointer());
                logger.success(`Size: ${totalBytes}`);
                resolve();
            });
            archive.pipe(out);
            const distFolderRelative = path.relative(cwd, distFolder);
            const xpiPathRelative = path.relative(cwd, xpiPath);
            const sourcesArchivePathRelative = path.relative(cwd, sourcesArchivePath);
            archive.glob(sourcesGlob, {
                cwd,
                ignore: [
                    'node_modules/**',
                    distFolderRelative,
                    path.posix.join(distFolderRelative, '**'),
                    xpiPathRelative,
                    sourcesArchivePathRelative,
                ],
                ...sourcesGlobOptions,
            });
            archive.finalize();
        });
    }
};
//# sourceMappingURL=prepare.js.map