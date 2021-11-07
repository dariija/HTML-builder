const fsPromises = require('fs/promises');
const path = require('path');

let folderPath = path.join(__dirname, 'secret-folder');

async function readFolderContent(folderPath) {
    let folderContent = await fsPromises.readdir(folderPath, {withFileTypes: true});
    for (let elem of folderContent) {
        if (elem.isFile()) {
            let elemPath = path.join(folderPath, elem.name);
            let elemPathStats = path.parse(elemPath);
            let elemStats = await fsPromises.stat(elemPath);
            console.log(`${elemPathStats.name} - ${elemPathStats.ext.slice(1)} - ${elemStats.size/1000}kb`)
        }
    }
};

readFolderContent(folderPath);
