// page only for logged in user
//////////// connection to supabase///////////////////////
const SUPABASE_URL = "https://xezktfaknsnlbnhupiiq.supabase.co"

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDMyNzc2MywiZXhwIjoxOTQ5OTAzNzYzfQ.aXguPua-LsvqbJgnyqwDKq437mEYz0pLdCHRfeChno4'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
/////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function (event) {

    var logoutButton = document.querySelector('#logout-button')
    logoutButton.onclick = logoutSubmitted.bind(logoutButton)

    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("date")[0].setAttribute('min', today);
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
// console.log(loginMail + "1")
var supMail = sessionStorage.getItem('upMail')
// console.log(supMail+ "2")
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

async function getProfileName() {
    const { data, error } = await supabase.from('profile').select('pname').eq('email', showMail)
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

var credit = getRandomInt(1, 500)

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
    return result[0]
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
    time = document.getElementsByName("time").value
    numGuests = document.getElementsByName("numGuests").value

    tableReserved = storeSelected();

    // console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd)
    // console.log("day " + day.getDay())

    // insert data into supabase
    let { error } = await supabase
        .from("reservations")
        .insert([
            {
                name: userName,
                phoneNumber: phoneNumber,
                eMail: eMail,
                date: date,
                time: time,
                numGuest: numGuests,
                tableReserved: tableReserved
            },
        ])
    // console.log("start")
    // console.log(phoneNumber)
    // console.log(eMail)
    // console.log(error)
    // console.log(date) //here?
    // console.log(numGuests)

    //get credit and post every time reservation is made
    currentCredit = await getCredit()
    console.log("current credit is " + currentCredit)
    console.log(typeof currentCredit);
    currentCredit += credit
    console.log("earned credit " + credit)
    console.log(typeof credit);
    console.log("updated credit " + currentCredit)
    updateCredit()

    //retrieves current tables available for the purpose of updating values
    let { data } = await supabase.from('tablesAvailable').select()
    tablesOfTwo = data.map(a => a.tablesOfTwo);
    tablesOfFour = data.map(a => a.tablesOfFour);
    tablesOfSix = data.map(a => a.tablesOfSix);
    tablesOfEight = data.map(a => a.tablesOfEight);

    tablesOfTwo = tablesOfTwo[tablesOfTwo.length - 1];
    tablesOfFour = tablesOfFour[tablesOfFour.length - 1];
    tablesOfSix = tablesOfSix[tablesOfSix.length - 1];
    tablesOfEight = tablesOfEight[tablesOfEight.length - 1];

    // console.log(tablesOfFour);


    for (index = 0; index < tableReserved.length; index++) {
        if (tableReserved[index] == 2) {
            tablesOfTwo--;
        }
        else if (tableReserved[index] == 4) {
            tablesOfFour--;
        }
        else if (tableReserved[index] == 6) {
            tablesOfSix--;
        }
        else if (tableReserved[index] == 8) {
            tablesOfEight--;
        }
    }

    error = await supabase
        .from("tablesAvailable")
        .insert([
            {
                tablesOfTwo: tablesOfTwo,
                tablesOfFour: tablesOfFour,
                tablesOfSix: tablesOfSix,
                tablesOfEight: tablesOfEight
            },
        ])
    alert("Hello! did you know you can save 100$ on your car insurance by registering and making a reservation today?\n\nyou just made a reservation ");
});

async function updateCredit() {
    const { error } = await supabase
        .from('profile')
        .update({ credit: currentCredit })
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
    return numGuest;
}

numGuest.onchange = function () {
    printTables(tables())
}

function checkDay() {
    var date = document.getElementById("inputDate").value
    var dateField = document.getElementById('dateField')
    // normal date format is 1 day off when getday, replace " - " with " / " result in correct date
    // js is weird like that
    // console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd).getDay()
    let month = new Date(tempd).getMonth() + 1
    let daym = new Date(tempd).getDate()
    // console.log("month " + month)
    // console.log("day " + daym)
    /////////////////////////////////
    let child = document.createElement("input")
    let childLabel = document.createElement("Label")
    let breaker = document.createElement("br")
    child.setAttribute('type', 'number')
    child.setAttribute('placeholder', 'credit card number')
    child.setAttribute('id', 'ccField')
    child.required = true;
    childLabel.setAttribute("for", 'ccField')
    childLabel.setAttribute("id", 'ccLabel')
    childLabel.innerHTML = "please enter a valid credit card due to busier then normal traffic"
    breaker.setAttribute("id", 'ccBreaker')
    let cc = document.getElementById('ccField')
    let cclabel = document.getElementById('ccLabel')
    let breakerx = document.getElementById('ccBreaker')

    var holiday = new Date("10 december 1111");
    console.log("holiday is " + holiday)
    /////////////////////////////////////////////
    let flag = false

    if (day == 0 || day == 6) {
        flag = true
    }
    if (day !== 0 && day !== 6) {
        flag = false
    }
    if (month == 12 && daym == 10) {
        flag = true
    }

    if (flag) {
        dateField.appendChild(childLabel)
        dateField.appendChild(breaker)
        dateField.appendChild(child)
    } else {
        cc.remove()
        cclabel.remove()
        breakerx.remove()
    }
    // if (day == 0 || day == 6) {
    //     dateField.appendChild(childLabel)
    //     dateField.appendChild(breaker)
    //     dateField.appendChild(child)
    // } else if (month == 12 && day == 3){
    //     dateField.appendChild(childLabel)
    //     dateField.appendChild(breaker)
    //     dateField.appendChild(child)
    // }
    // if (day !== 0 && day !== 6) {
    //     // console.log("triggered")
    //     cc.remove()
    //     cclabel.remove()
    //     breakerx.remove()
    // } 

}

//function returns combinations of max 3 values for a specified target
async function tableCalc(candidates, target) {
    const combinations = [];
    if (target % 2 != 0) {
        target++;
    }
    const combinSum = async (sum = 0, curr = [], start = 0) => {
        if (sum > target) return;
        if (sum == target) {
            if (curr.length <= 3) {
                var allAvail = true;
                var tOfTwo = await (checkTables(2));
                var tOfFour = await (checkTables(4));
                var tOfSix = await (checkTables(6));
                var tOfEight = await (checkTables(8));
                for (i = 0; i < curr.length; i++) {
                    if (curr[i] == 2) {
                        tOfTwo--;
                        //console.log(tOfTwo)
                        if (tOfTwo < 0) {
                            allAvail = false;
                            break;
                        }
                    }
                    else if (curr[i] == 4) {
                        tOfFour--;
                        //console.log(tOfFour)
                        if (tOfFour < 0) {
                            allAvail = false;
                            break;
                        }
                    }
                    else if (curr[i] == 6) {
                        tOfSix--;
                        //console.log(tOfSix)
                        if (tOfSix < 0) {
                            allAvail = false;
                            break;
                        }
                    }
                    else if (curr[i] == 8) {
                        tOfEight--;
                        //console.log(tOfEight)
                        if (tOfEight < 0) {
                            allAvail = false;
                            break;
                        }
                    }
                }

                if (allAvail) {
                    combinations.push(curr);
                }
            }
            return;
        }

        for (let index = start; index < candidates.length; index++) {
            const num = candidates[index];
            await combinSum(num + sum, [...curr, num], index);
        }
    };

    await combinSum();
    return combinations;
};

//Helper function to make tables
async function calculateTables(numGuests) {
    tableOptions = []
    var tables = await tableCalc([2, 4, 6, 8], numGuests)
    for (let index = 0; index < tables.length; index++) {
        tableOptions.push(tables[index])
    }
    return tableOptions;
}

//Helper function to parse tables
function parseTablesText(numGuests, tableResult, i) {
    numGuests = tables()
    var currOption = 'Tables for ' + tables() + ' seating ' + tableResult[i].toString()
    return currOption;
}

//Helper function to print tables
async function printTables(numGuests) {
    deleteChild(tableSelect)
    deleteChild(selectList)
    var numGuests = tables()
    selectList.id = "tables";
    var combinations = await calculateTables(numGuests)
    for (let i = 0; i < combinations.length; i++) {
        let option = document.createElement("option");
        option.value = combinations[i]
        option.text = parseTablesText(numGuests, combinations, i)
        selectList.appendChild(option)
    }
    tableSelect.appendChild(selectList);
}

//stores user's current selected reservation value. Updates if selection change is made. 
function storeSelected() {
    tableReserved = [];
    for (let index = 0; index < selectList.options[selectList.selectedIndex].value.length; index++) {
        if (isNum(selectList.options[selectList.selectedIndex].value[index])) {
            tableReserved.push(selectList.options[selectList.selectedIndex].value[index]);
            // console.log(selectList.options[selectList.selectedIndex].value[index])
        }
    }

    return tableReserved;
}

//Clears the current cache of selected tables, used before updating with new selection
function deleteChild(e) {
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

//included to exclude commas from final reservation array
function isNum(val) {
    return !isNaN(val)
}

//helper function for checkTables
function parseTables(num) {
    if (num == 2) {
        return 'tablesOfTwo'
    }
    else if (num == 4) {
        return 'tablesOfFour'
    }
    else if (num == 6) {
        return 'tablesOfSix'
    }
    else if (num == 8) {
        return 'tablesOfEight'
    }
}

//checks if all tables in current selection are available
async function checkTables(tableColumn) {
    tableCol = parseTables(tableColumn)
    const { data } = await supabase.from('tablesAvailable').select(tableCol)

    if (tableColumn == 2) {
        result = data.map(a => a.tablesOfTwo);
    }
    else if (tableColumn == 4) {
        result = data.map(a => a.tablesOfFour);
    }
    else if (tableColumn == 6) {
        result = data.map(a => a.tablesOfSix);
    }
    else if (tableColumn == 8) {
        result = data.map(a => a.tablesOfEight);
    }
    res = result[result.length - 1];

    return res;
}