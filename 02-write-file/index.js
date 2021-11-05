const fs = require('fs');
const path = require('path');
const readline = require('readline');

let filePath = path.join(__dirname, 'text.txt');
let writableStream = fs.createWriteStream(filePath);
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Hello! Write somethig here:', function(text) {
    writableStream.write(text, function(error) {
        if (error) throw error
    })
});

rl.on('line', function(text) {
    if (text === 'exit') rl.close();
    writableStream.write(`\n${text}`, function(error) {
        if (error) throw error
    })
});

rl.on('close', function() {
    console.log('Bye!');
    process.exit();
});