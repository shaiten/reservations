/*
    Array storing username/password on Login
 */

function storeLoginInfo (username, password){
    var userLoginAttempt = {
        login: document.getElementById("Uname").value,
        password: document.getElementById("password").value
    };
    loginCheck(username, password);
}

/* create state for logged in  loggedInState
function login check takes form input username,password and checks it against array 
storedLogin and updates login check normally server side, run everytime submit is clicked */

let loggedInState = true;
function loginCheck (username, password){
    let loginCheck = false;
    // for (const element of storedLogin)(
    //     if (element.username == username && element.password == password){
    //         loginCheck = true;
    //     }
    // );
    // for loop needed to be commented out because it is throwing errors since im using array thats not there
    return loginCheck;
}
if (loggedInState == true){
    console.log("logged in");
}