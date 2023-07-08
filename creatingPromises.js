let myPromise=new Promise(function(resolve,reject){
    let num1=1;
    let num2=1;
    let string="value is :";
    if(num1+num2==2){
        resolve(string);
    }else{
        reject("No,values are not equal");
    }
});

myPromise.then(function(string) {
    console.log(string);   
});
myPromise.catch(function () {
    console.log(err);   
})