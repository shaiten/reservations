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

    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("date")[0].setAttribute('min', today);
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
            response.error ? alert(response.error.message) : setToken(response), window.location.href = "profile.html"
        })
        .catch((err) => {
            console.log(err)
        })

    sessionStorage.setItem('upMail', email)
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
            response.error ? console.log(response.error.message) : setToken(response), window.location.href = "reservations.html"
        })
        .catch((err) => {
            console.log(err)
        })
    console.log(email)
    sessionStorage.setItem('inMail', email)

}

////////////////////////////////////////////////////////////////////
// 


function setToken(response) {
    if (response.data.confirmation_sent_at && !response.data.access_token) {
        console.log('succesful signup')
    } else {
        console.log('Logged in as ' + response.user.email)
    }
}


const maxOccupancy = 20;

const tableSelect = document.getElementById("tableRes");
var selectList = document.createElement("select");
var tableReserved = [];

var tablesOfTwo;
var tablesOfFour;
var tablesOfSix;
var tablesOfEight;

function tables() {
    var numGuest = document.getElementById("numGuest").value
    return numGuest;
}

numGuest.onchange = function () {
    printTables(tables())
}

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

    tableReserved = storeSelected();

    console.log("date " + date)
    let tempd = new Date(date.replace(/-/g, '\/'))
    let day = new Date(tempd)
    console.log("day " + day.getDay())


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
    console.log(error)

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

    console.log(tablesOfFour);


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
    child.required = true;
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
            console.log(selectList.options[selectList.selectedIndex].value[index])
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