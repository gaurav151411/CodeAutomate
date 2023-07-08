const puppeteer=require("puppeteer");
let {email,password}=require("./secrets");
let {answer}=require("./codes")
let current_Tab;
let browserOPenPromise=puppeteer.launch({ //puppeteer gave promise
    headless:false,
    defaultViewport: null,
    args:["--start-maximized"],
    // executablePath:"	/Applications/Google Chrome.app/Contents/MacOS/Google",
});

browserOPenPromise
.then(function(browser){
    console.log("browser is open");
    // an array of all open pages inside browser is returned
    let allTabsPromise=browser.pages();
    return allTabsPromise;
})
.then(function(allTabsArr){
    current_Tab=allTabsArr[0];
    console.log("new tab");
    //URL TO NAVIGATE THE PAGE
    let visitingLoginPagePromise=current_Tab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function () {
    console.log("Hackerrank login page opened");
    let emailWillBeTypedPromise = current_Tab.type("input[name='username']", email, {delay:100});
    return emailWillBeTypedPromise;
  })
.then(function(){
    console.log("email is typed");
    let passwordWillBeTypedPromise=current_Tab.type("input[type='password']",password,{delay:100});
    return passwordWillBeTypedPromise;
})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise=current_Tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return willBeLoggedInPromise;
})
.then(function () {
    console.log("logged into hackerrank successfully"); 
    // waitAndClick will wait for the entire webpage to load and then  click on the algorithm button
    let algorithmTabWillBeOpenedPromise=
    waitAndClick("div[data-automation='algorithms']");
   
    return algorithmTabWillBeOpenedPromise;
})

.then(function(){
    console.log("algorithm pages is opened");
    let allQuesPromise=current_Tab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
    return allQuesPromise;
}) 

.then(function(){
    function getAllQuesLinks(){
        let allElemArr=document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        let linksArr=[];
        for(let i=0;i<allElemArr.length;i++){
            linksArr.push(allElemArr[i].getAttribute("href"));
        }

        return linksArr;  //relative link is obtained   
    }
    let linksArrPromise=current_Tab.evaluate(getAllQuesLinks);
    return linksArrPromise;
})
.then(function(linksArr){
    console.log("links to all ques recieved");
    console.log(linksArr);
    // question solve karna hai
    let questionwillbesolvedPromise=questionSolver(linksArr[0],0);
})
.then(function(){
  console.log("Question is solved");
})
.catch(function(err){
    console.log(err);
});


function waitAndClick(algoBtn){
  //returns a promise
    // console.log(algoBtn);
    let waitClickPromise=new Promise(function(resolve,reject){
        let waitForSelectorPromise=current_Tab.waitForSelector(algoBtn);

        waitForSelectorPromise.then(function(){
            console.log("algo button is found");
            let clickPromise=current_Tab.click(algoBtn);
            return clickPromise;
        })
        .then(function(){
            console.log("algo btn is clicked");
            resolve();
        })
        .catch(function(err){
           reject(err);
        })
    })
    return waitClickPromise;
}

function questionSolver(url,idx){
    return new Promise(function(resolve,reject){
        let fullLink=`https://www.hackerrank.com${url}`;
        let goToQuesPromise=current_Tab.goto(fullLink);
        // question page opened

        goToQuesPromise
        .then(function(){
            console.log("question opened");
            // tick the custom input box mark
            let waitForCheckBoxAndClickPromise=waitAndClick(".checkbox-input");
            return waitForCheckBoxAndClickPromise;
        })
        .then(function () {
            //select the box where code will be typed
            let waitForTextBoxPromise = current_Tab.waitForSelector(".custominput");
            return waitForTextBoxPromise;
          })
          .then(function () {
            let codeWillBeTypedPromise = current_Tab.type(".custominput", answer[idx]);
            return codeWillBeTypedPromise;
          })
          .then(function () {
            //control key is pressed promise
            let controlPressedPromise = current_Tab.keyboard.down("Control");
            return controlPressedPromise;
          })
          .then(function () {
            let aKeyPressedPromise = current_Tab.keyboard.press("a");
            return aKeyPressedPromise;
          })
          // select all done till now
          .then(function () {
            let xKeyPressedPromise =current_Tab.keyboard.press("x");
            return xKeyPressedPromise;
          })
          .then(function () {
            let controlDownPromise = current_Tab.keyboard.up("Control");
            return controlDownPromise;
          })
          .then(function () {
            //select the editor promise
            let cursorOnEditorPromise = current_Tab.click(
              ".monaco-editor.no-user-select.vs"
            );
            return cursorOnEditorPromise;
          })
          .then(function () {
            //control key is pressed promise
            let controlPressedPromise = current_Tab.keyboard.down("Control");
            return controlPressedPromise;
          })
          .then(function () {
            let aKeyPressedPromise = current_Tab.keyboard.press("a");
            return aKeyPressedPromise;
          })
          .then(function () {
            let vKeyPressedPromise = current_Tab.keyboard.press("v");
            return vKeyPressedPromise;
          })
          .then(function () {
            let controlDownPromise = current_Tab.keyboard.up("Control");
            return controlDownPromise;
          })
          .then(function () {
            let submitButtonClickedPromise = current_Tab.click(".hr-monaco-submit");
            return submitButtonClickedPromise;
          })
    
          .then(function () {
            console.log("code submitted successfully");
            resolve();
          })
          .catch(function (err) { 
            reject(err);
          });
    
    }) ;
   

}