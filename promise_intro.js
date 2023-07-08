const fs = require('fs');

console.log("before");

//synchronous working
// let data=fs.readFileSync("f1.txt");
// console.log(data + "");

//async working 
// fs.readFile("f1.txt", cb);
// function cb(err, data) {
//     if (err) {
//         console.log(err);
//     }
//     else console.log(data+"");
// }

// promises working
let promiseThatFile1WillBeRead = fs.promises.readFile("f1.txt");
let promiseThatFile2WillBeRead=  fs.promises.readFile("f2.txt");
console.log(promiseThatFile2WillBeRead);


// promiseThatFileWillBeRead
//     .then(function printData(data) {
//   console.log("promise is fulfilled");
//   console.log(data + "");
//     });

promiseThatFile1WillBeRead.then(printData);
promiseThatFile2WillBeRead.catch(printError);
console.log("after");

  

function printData(data) {
    console.log("promise is fulfilled");
    console.log(data+"");
}

function printError(err) {
  console.log(err);
}