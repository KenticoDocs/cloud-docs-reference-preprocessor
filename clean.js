var fs = require('fs');

const folderToClean = './dist';

function processDeletePath(path) {
  fs.readdirSync(path).forEach(function(file, index){
    var curPath = path + '/' + file;

    if (fs.lstatSync(curPath).isDirectory()) { // recurse
      deleteFolderRecursive(curPath);
    } else { // delete file
      fs.unlinkSync(curPath);
    }
  });
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    processDeletePath(path);
    console.log(`Deleting directory '${path}'`);
    fs.rmdirSync(path);
  }
};

console.log('Cleaning ...');

deleteFolderRecursive(folderToClean);

console.log('Successfully cleaned!');