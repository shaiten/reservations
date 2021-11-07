//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)


//////////////////////////////////////////////////////////////
// reservations form
const form = document.getElementById("reservation");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    userName = e.target[0].value
    phoneNumber = e.target[1].value
    eMail = e.target[2].value
    date = e.target[3].value
    time = e.target[4].value
    numGuests = e.target[5].value
   
    console.log(userName, phoneNumber, eMail, date, time, numGuests)

    const { data, error } = await supabase
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
   
    // insert data into supabase
  
  });

