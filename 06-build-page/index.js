const fsPromises = require('fs/promises');
const path = require('path');

let newFolderPath = path.join(__dirname, 'project-dist');
    newHtmlFilePath = path.join(newFolderPath, 'index.html');
    componentsPath = path.join(__dirname, 'components');

let stylesPath = path.join(__dirname, 'styles');
    newStyleFilePath = path.join(newFolderPath, 'style.css');

let folderToCopyPath = path.join(__dirname, 'assets');
    newCopiedFolderPath = path.join(newFolderPath, 'assets');

async function buildPage() {
    await createFolder(newFolderPath);
    let htmlFileContent = await getContent(__dirname + '/template.html');
    htmlFileContent = await rewriteTags(htmlFileContent);
    await fsPromises.writeFile(newHtmlFilePath, htmlFileContent);
    await mergeStyles(stylesPath);
    await copyFolder(folderToCopyPath, newCopiedFolderPath);
}

async function createFolder(folderPath) {
    return fsPromises.mkdir(folderPath, {recursive: true})
}

async function getContent(filePath) {
    return await fsPromises.readFile(filePath, 'utf-8');
}

async function rewriteTags(fileContent) {
    let tagsRegex = /{{[A-z]+}}/g;
    let tags = fileContent.match(tagsRegex).map(function(tag) {
        return tag.substring(2, tag.length - 2)
    });
    for (let tag of tags) {
        let tagComponentContent = await getContent(componentsPath + `/${tag}.html`, 'utf-8');
        let tagRegex = new RegExp(`{{${tag}}}`, 'g');
        fileContent = fileContent.replace(tagRegex, tagComponentContent);
    };
    return fileContent
}

async function mergeStyles(stylesPath) {
    let styles = [];

    let folderContent = await fsPromises.readdir(stylesPath, {withFileTypes: true});
    for (let elem of folderContent) {
        let elemPath = path.join(stylesPath, elem.name);
        if (elem.isFile() && path.extname(elemPath) === '.css') {
            let elemContent = await getContent(elemPath);
            styles.push(elemContent + '\n');
        }
    };
    await fsPromises.writeFile(newStyleFilePath, styles);
}

async function copyFolder(folderPath, copyPath) {
    await fsPromises.rm(copyPath, {force: true, recursive: true});
    await createFolder(copyPath);
    let files = await fsPromises.readdir(folderPath, {withFileTypes: true});
    for (elem of files) {
        let currentElemPath = path.join(folderPath, elem.name);
        let copyElemPath = path.join(copyPath, elem.name);
        if (elem.isDirectory()) {
            await createFolder(copyElemPath);
            await copyFolder(currentElemPath, copyElemPath);
        } else {
            await fsPromises.copyFile(currentElemPath, copyElemPath)
        }
    }
}

buildPage();