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