// page only for logged in user
//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
/////////////////////////////////////////////////////////////////////
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
// session storage stuff 

var loginMail = sessionStorage.getItem('inMail')
// console.log(loginMail)
var supMail = sessionStorage.getItem('upMail')
// console.log(supMail)
// var profileName = sessionStorage.getItem('name') //removed to update from db
// console.log(profileName)
const formName = document.getElementById("formName");
const formMail = document.getElementById("formMail");
var showMail
if (supMail == null) {
  showMail = loginMail
} else {
  showMail = supMail
}

// formName.setAttribute('placeholder', profileName)
// formMail.setAttribute('placeholder', showMail)
formMail.setAttribute('value', showMail)
console.log(formMail)
// console.log(loginMail)
// console.log(supMail)
// console.log(profileName)
async function getProfileName() {
  const { data, error } = await supabase.from('profile').select('pname').eq('email', formMail)
  result = data.map(a => a.pname).toString()
  return result
}

//////////////////////////////////////////////////////////////
// user credit stuff
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let credit = getRandomInt(1, 500)

///below reservations show current credit

//everytime reservation is made update credit add new value
const greetings = document.getElementById("greeting");

async function renderCredit() {
  var result = await getCredit()
  var profileName = await getProfileName()
  formName.setAttribute('value', profileName)
  greetings.innerText = "hello " + profileName + " your current credit is $" + result
}
async function getCredit() {
  var profileName = await getProfileName()
  const { data } = await supabase.from('profile').select('credit').eq('pname', profileName)
  result = data.map(a => a.credit)
  // console.log(result[1])
  return result[1]
}
renderCredit()
//////////////////////////////////////////////////////////////
// reservations form
const form = document.getElementById("reservation");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (supMail == null) {
    eMail = loginMail
  } else {
    eMail = supMail
  }
  var profileName = await getProfileName()
  userName = profileName
  phoneNumber = e.target[1].value
  date = e.target[3].value
  time = e.target[4].value
  numGuests = e.target[5].value

  // userName = e.target[0].value
  // phoneNumber = e.target[1].value
  // eMail = e.target[2].value
  // date = e.target[3].value
  // time = e.target[4].value
  // numGuests = e.target[5].value

  console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd)
    console.log("day " + day.getDay())

  // insert data into supabase
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
  //get credit and post every time reservation is made
  result = await getCredit()
  result += credit
  console.log(credit)
  updateCredit()
});

async function updateCredit() {
  const { error } = await supabase
    .from('profile')
    .update({ credit: result })
    .eq('pname', userName)
  console.log(error)
}

/////////////////////////////////////////////////////////
// copied from index
///////////////////////////////////////////////////////////
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
}

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