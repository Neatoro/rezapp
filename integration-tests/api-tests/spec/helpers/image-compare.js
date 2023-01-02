const fs = require('fs/promises');

module.exports = async function compareImage(path, blob) {
    const file = await fs.readFile(path);
    return Buffer.compare(file, blob) === 0;
};
