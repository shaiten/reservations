//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null

///////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function (event) {
    var signUpForm = document.querySelector('#signUp')
    signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)


    var logInForm = document.querySelector('#logIn')
    logInForm.onsubmit = logInSubmitted.bind(logInForm)

})
/////////////////////////////////////////////////////////////
// response of signin and signup us a token, need to set that to work
const signUpSubmitted = (event) => {
    event.preventDefault()
    const email = event.target[0].value
    const password = event.target[1].value
    /// signup
    supabase.auth
        .signUp({ email, password })
        .then((response) => {
            response.error ? alert(response.error.message) : setToken(response)
        })
        .catch((err) => {
            console.log(err)
        })

    sessionStorage.setItem('upMail', email)
}

const logInSubmitted = (event) => {
    event.preventDefault()
    const email = event.target[0].value
    const password = event.target[1].value

    // signin
    supabase.auth
        .signIn(
            { email, password }
        )
        .then((response) => {
            response.error ? console.log(response.error.message) : setToken(response)
        })
        .catch((err) => {
            console.log(err)
        })
    console.log(email)
    sessionStorage.setItem('inMail', email)

}

////////////////////////////////////////////////////////////////////
// logout

const logoutSubmitted = (event) => {
    supabase.auth
        .signOut()
        .then((response) => {
            console.log('Logout successful')
        })
        .catch((err) => {
            console.log(err.response.text)
        })
}

function setToken(response) {
    if (response.data.confirmation_sent_at && !response.data.access_token) {
        console.log('succesful signup')
        //     rerouting on success here
        window.location.href = "profile.html"
    } else {
        console.log('Logged in as ' + response.user.email)
        //change this to reservations that is signed in
        window.location.href = "reservations.html"
    }
}

///////////////////////////////////////////////////////////////////
// table
// on input detect number of guest and give table option .. form sends table reserved
// on input check for tables at date and time.. display tables or no table available
const tTable = 2, fTable = 4, sTable = 6, eTable = 8;
const maxOccupancy = 20;

//////////////////////////////////////////////////////////
// var numGuest = document.getElementById("numGuest")
// numGuest.onchange = function () {
//     var finalg = numGuest.value
//     if (finalg % 2 !== 0) {
//         finalg = +finalg + +1
//     }
//     return finalg
// }
// console.log("guest are " + finalg)

// /testing function/////////////////////////////////
const tableSelect = document.getElementById("tableRes");
var selectList = document.createElement("select");

function tables() {
    var numGuest = document.getElementById("numGuest").value
    finalGuest = numGuest
    if (numGuest % 2 !== 0) {
        numGuest = +numGuest + +1
    }
    return numGuest
}

numGuest.onchange = function () {
    var finalGuest = tables()
    console.log("guest are " + finalGuest)

    // possible combinations for 2 4 6 8
    // 20 8+6+4+2  no reservations possible
    // 18 8+6+4  leftover 2
    // 16 8+6+2    leftover 4
    // 14 8+4+2 8+6 
    // 12 6+4+2  8+4
    // 10 8+2  6+4 
    // 8  8  2+6 
    // 6  6  4+2 
    // 4  4
    // 2  2
    // supabase tableReserved, tableSelect = parent div,
    // for numbers with 2 options save as x.1 or x.2 
    selectList.id = "tables";
    var array20 = ["tables for 20 seating 2, 4, 6, 8"];
    var array18 = ["tables for 18 seating 8, 6, 4"];
    var array16 = ["tables for 16 seating 8, 6, 2"];
    var array14 = ["tables for 14 seating 8, 4, 2", "tables for 14 seating 8, 6"];
    var array12 = ["tables for 12 seating 6, 4, 2", "tables for 12 seating 8, 4"];
    var array10 = ["tables for 10 seating 8, 2", "tables for 10 seating 6, 4"];
    var array8 = ["tables seating 8", "tables for 8 seating 2, 6"];
    var array6 = ["tables seating 6", "tables for 6 seating 4, 2"];
    var array4 = ["tables seating 4"];
    var array2 = ["tables seating 2"]
    if (finalGuest == 2) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array2.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array2[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 4) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array4.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array4[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 6) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array6.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = arraarray6y2[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 8) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array8.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array8[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 10) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array10.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array10[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 12) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array12.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array12[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 14) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array14.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array14[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 16) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array16.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array16[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 18) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array18.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array18[i]
            selectList.appendChild(option)
        }
    }
    if (finalGuest == 20) {
        tableSelect.appendChild(selectList);
        for (let i = 0; i < array20.length; i++) {
            let option = document.createElement("option");
            option.value = i
            option.text = array20[i]
            selectList.appendChild(option)
        }
    }
}

// going crazy 2nd textcontent resets the promise object put there by the function
// working from and adding names
// const test = document.getElementById("test");
// test.textContent = getTest()
// test.textContent = " "
// async function getTest() {
//     const { data } = await supabase.from('reservations').select('name')
//     result = data.map(a => a.name);
//     console.log(result)
//     console.log(result[0])

//     for (const row of data) {
//         const child = document.createElement("p")
//         child.textContent = row.name
//         test.appendChild(child)
//     }
// }
//////////////////////////////////////////////////////////
// reservation form post
const form = document.getElementById("reservation");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    userName = e.target[0].value
    phoneNumber = e.target[1].value
    eMail = e.target[2].value
    date = e.target[3].value
    time = e.target[4].value
    numGuests = e.target[5].value


    console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd)
    console.log("day " + day.getDay())


    const { error } = await supabase
        .from("reservations")
        .insert([
            {
                name: userName,
                phoneNumber: phoneNumber,
                eMail: eMail,
                date: date,
                time: time,
                numGuest: numGuests
            },
        ])
    console.log(error)

})

function checkDay() {
    let date = document.getElementById("inputDate").value
    let dateField = document.getElementById('dateField')

    // normal date format is 1 day off when getday, replace " - " with " / " result in correct date
    // js is weird like that
    console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd).getDay()
    console.log("day " + day)


    /////////////////////////////////
    let child = document.createElement("input")
    let childLabel = document.createElement("Label")
    let breaker = document.createElement("br")
    child.setAttribute('type', 'number')
    child.setAttribute('placeholder', 'credit card number')
    child.setAttribute('id', 'ccField')
    childLabel.setAttribute("for", 'ccField')
    childLabel.setAttribute("id", 'ccLabel')
    childLabel.innerHTML = "please enter a valid credit card due to busier then normal traffic"
    breaker.setAttribute("id", 'ccBreaker')
    let cc = document.getElementById('ccField')
    let cclabel = document.getElementById('ccLabel')
    let breakerx = document.getElementById('ccBreaker')
    /////////////////////////////////////////////
    if (day == 0 || day == 6) {
        dateField.appendChild(childLabel)
        dateField.appendChild(breaker)
        dateField.appendChild(child)
    }
    if (day !== 0 && day !== 6) {
        // console.log("triggered")
        cc.remove()
        cclabel.remove()
        breakerx.remove()
    }
}

