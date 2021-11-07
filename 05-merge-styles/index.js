const fsPromises = require('fs/promises');
const path = require('path');

let stylesPath = path.join(__dirname, 'styles');
let bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(stylesPath) {
    let files = await fsPromises.readdir(stylesPath, {withFileTypes: true});
    let styles = [];

    for (let file of files) {
        let filePath = path.join(stylesPath, file.name);
        if (file.isFile() && path.extname(filePath) === '.css') {
            let fileContent = await fsPromises.readFile(filePath, 'utf-8');
            fileContent = '\n' + fileContent;
            styles.push(fileContent);
        }
    };
    await fsPromises.writeFile(bundlePath, styles);
};

mergeStyles(stylesPath);