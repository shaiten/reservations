//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)


//////////////////////////////////////////////////////////////

function setToken(response) {
    if (response.data.confirmation_sent_at && !response.data.access_token) {
        console.log('successful signup')
        //     rerouting on success here
        window.location.href = "reservations.html"
    } else {
        console.log('Logged in as ' + response.user.email)
        //change this to reservations that is signed in
        window.location.href = "reservations.html"
    }
}
//////////////////////////////////////////////////////////////
// reservations form
const form = document.getElementById("reservation");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    name = e.target[0].value
    phoneNumber = e.target[1].value
    eMail = e.target[2].value
    date = e.target[3].value
    time = e.target[4].value
    numGuests = e.target[5].value
   
    console.log(name, phoneNumber, eMail, date, time, numGuests)

    const { data, error } = await supabase.from("reservations").insert([
      {
        name: name,
        phoneNumber: phoneNumber,
        eMail: eMail,
        date: date,
        time: time,
        numGuests: numGuests
      },
    ]); 
    // insert data into supabase
  
  });

