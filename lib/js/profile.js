//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)


///////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function (event) {

    var logoutButton = document.querySelector('#logout-button')
    logoutButton.onclick = logoutSubmitted.bind(logoutButton)

})
/////////////////////////////////////////////////////////////

const logoutSubmitted = (event) => {
    supabase.auth
        .signOut()
        .then((response) => {
            console.log('Logout successful')
            window.location.href = "index.html"
        })
        .catch((err) => {
            console.log(err.response.text)
        })
}

/////////////////////////////////////////////////////////////
//get email and store it in the post behind the scene
var supMail = sessionStorage.getItem('upMail')
//////////////////////////////////////////////////////////////
// profile form
const form = document.getElementById("profile");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    pName = e.target[0].value
    mAddress = e.target[1].value
    bAddress = e.target[2].value
    addressCheck = e.target[3].checked
    pMethod = e.target[4].value
    storage = bAddress
    if (addressCheck) {
        bAddress = mAddress
    } else {
        bAddress = storage
    }
    console.log("storage is ", storage)
    // console.log(pName, mAddress, bAddress, addressCheck, pMethod)
    sessionStorage.setItem('name', pName)
    // insert data into supabase
    const { data, response } = await supabase.from("profile").insert([
      {
        pname: pName,
        mAddress: mAddress,
        bAddress: bAddress,
        pMethod: pMethod,
        email: supMail
      },
    ]).then((response) => {
        response.error ? alert(response.error.message) : window.location.href = "reservations.html"
    })
    window.location.href = "reservations.html"
  });

// emails from signup / sign in
let loginMail = sessionStorage.getItem('inMail')
console.log(loginMail)

// let supMail = sessionStorage.getItem('upMail')
// console.log(supMail)

// let profileName = sessionStorage.getItem('name')
// console.log(profileName)