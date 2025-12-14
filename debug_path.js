const path = require('path');
const fs = require('fs');

// Simulate the controller's location
const controllerDir = path.join(__dirname, 'controllers');
const vidDir = path.join(__dirname, 'vid');

console.log('Controller Dir:', controllerDir);
console.log('Vid Dir:', vidDir);

// Simulate the logic in verVideoTutorial
const file = '4ZFxTK8Xjo-lCl-4avgh4EE-.mp4'; // Use a file I know exists
const path_file = path.join(controllerDir, '../vid', file);

console.log('Resolved Path:', path_file);
console.log('Absolute Path:', path.resolve(path_file));

fs.stat(path_file, function (err, stats) {
    if (err) {
        console.error('Error accessing file:', err);
    } else {
        console.log('File found!');
        console.log('Is File:', stats.isFile());
        console.log('Size:', stats.size);
    }
});
