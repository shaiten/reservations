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
        window.location.href = "profile.html"
    }
}

///////////////////////////////////////////////////////////////////
// details
const tTable = 2, fTable = 4, sTable = 6, eTable = 8;
const maxOccupancy = 20;
let highTraffic = true;

// going crazy 2nd textcontent resets the promise object put there by the function
// working from and adding names
// const test = document.getElementById("test");
//  test.textContent =  getTest()
//  test.textContent =  " "
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
//   }
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