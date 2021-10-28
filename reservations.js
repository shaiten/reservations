//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null
////////////////////////////////////////////////////////////////////////////
const reservationForm = document.querySelector('#reservationForm')
reservationForm.addEventListener('submit', async(event) =>{
 event.preventDefault()
 const formInputs = reservationForm.querySelectorAll('input, select, textarea')
 let userSubmission = {}

 formInputs.forEach(element => {
  const {value, name} = element
  if (value){
   userSubmission[name] = value
  }
 })

 console.log(userSubmission)
})
////////////////////////////////////////////////////
