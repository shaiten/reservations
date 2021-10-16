//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null
////////////////////////////////////////////////////////////////////////////

///// bind event with button///////////////////
document.addEventListener('DOMContentLoaded', function (event) {
  var signUpForm = document.querySelector('#signUp')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)
  

  var logInForm = document.querySelector('#logIn')
  logInForm.onsubmit = logInSubmitted.bind(logInForm);
  

  var userDetailsButton = document.querySelector('#user-button')
  userDetailsButton.onclick = fetchUserDetails.bind(userDetailsButton)

  var logoutButton = document.querySelector('#logout-button')
  logoutButton.onclick = logoutSubmitted.bind(logoutButton)

})
////////////////////////////////////////////////////////////////////////////

//////////defining event//////////////////////////////
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
      console.log(err.response.text)
    })
}

const logInSubmitted = (event) => {
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value

  // signin
  supabase.auth
    .signIn({ email, password })
    .then((response) => {
      response.error ? console.log(response.error.message) : setToken(response)
    })
    .catch((err) => {
      console.log(err.response.text)
    })

}
///////////////////////////////////////////////////////


const fetchUserDetails = () => {
  console.log(JSON.stringify(supabase.auth.user()))
}

const logoutSubmitted = (event) => {
  event.preventDefault()

  //////////////////////// sign out
  supabase.auth
    .signOut()
    .then((response) => {
      document.querySelector('#access-token').value = ''
      document.querySelector('#refresh-token').value = ''
      console.log('Logout successful')
    })
    .catch((err) => {
      console.log(err.response.text)
    })
}

function setToken(response) {
  if (response.data.confirmation_sent_at && !response.data.access_token) {
    console.log('succesful signup')
  } else {
    document.querySelector('#access-token').value = response.data.access_token
    document.querySelector('#refresh-token').value = response.data.refresh_token
    console.log('Logged in as ' + response.user.email)
  }
}
////////////////////////////////////////////////////
