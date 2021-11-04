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
        })
        .catch((err) => {
            console.log(err.response.text)
        })
}
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
    console.log(pName, mAddress, bAddress, addressCheck, pMethod)

    const { data, error } = await supabase.from("profile").insert([
      {
        pname: pName,
        mAddress: mAddress,
        bAddress: bAddress,
        pMethod: pMethod
      },
    ]); 
    // insert data into supabase
  
  });

