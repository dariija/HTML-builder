const fsPromises = require('fs/promises');
const path = require('path');

let folderToCopyPath = path.join(__dirname, 'files');
let newFolderPath = path.join(__dirname,'files-copy');

async function copyDirectory(folderPath, copyPath) {
    await fsPromises.rm(copyPath, {force: true, recursive: true});
    await createFolder(copyPath);
    let files = await fsPromises.readdir(folderPath, {withFileTypes: true});

    for (elem of files) {
        let currentElemPath = path.join(folderPath, elem.name);
        let copyElemPath = path.join(copyPath, elem.name);
        if (elem.isDirectory()) {
            await createFolder(copyElemPath);
            await copyDirectory(currentElemPath, copyElemPath);
        } else {
            await fsPromises.copyFile(currentElemPath, copyElemPath)
        }
    }
}

async function createFolder(folderPath) {
    return fsPromises.mkdir(folderPath, {recursive: true})
}

copyDirectory(folderToCopyPath, newFolderPath);