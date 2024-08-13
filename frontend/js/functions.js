
function showBar() {
    document.querySelector('.hamburger').classList.toggle('open')
    document.querySelector('.slideBar').classList.toggle('active')
    document.querySelector('.bgSlidebar').classList.toggle('active')
}

function showDetailsTransitions(id) {
    if (id == "") {
        document.getElementById('detailsTransitions').style.display = 'none'
        return
    }
    //on loading
    loading(true)

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var data = JSON.parse(this.response)
        for (var key in data) {
            if (data[key].id == id) {
                document.getElementById('DTId').innerHTML = data[key].id
                document.getElementById('DTName').innerHTML = data[key].name
                document.getElementById('DTPrice').innerHTML = data[key].price.toLocaleString() + " $"
                document.getElementById('DTFee').innerHTML = (data[key].price * 0.2 / data[key].staff).toLocaleString() + " $"
                document.getElementById('DTStaff').innerHTML = data[key].namestaff + ` (${data[key].staff})`
                document.getElementById('DTDate').innerHTML = data[key].date

                document.getElementById('detailsTransitions').style.display = ''
                //off loading
                loading(false)
            }
        }
    }
    xhttp.open("GET", "/listData", true);
    xhttp.send();
}

async function addmore() {
    var name = document.getElementById("name")
    var price = document.getElementById("price")
    var staff = document.getElementById("staff")
    var nameStaff = document.getElementById("nameStaff")
    var date = document.getElementById("dates")
    var isFalse = false

    if (!name.value.trim()) {
        name.classList.add('error');
        isFalse = true
    } else {
        name.classList.remove('error')
    }
    if (!price.value.trim() || price.value.trim() < 15) {
        price.classList.add('error');
        isFalse = true
    } else {
        price.classList.remove('error')
    }
    if (!staff.value.trim()) {
        staff.classList.add('error');
        isFalse = true
    } else {
        staff.classList.remove('error')
    }

    if (!nameStaff.value.trim()) {
        nameStaff.classList.add('error');
        isFalse = true
    } else {
        nameStaff.classList.remove('error')
    }
    if (!date.value) {
        date.classList.add('error');
        isFalse = true
    } else {
        date.classList.remove('error')
    }

    if (isFalse) {
        return
    }

    loading(true)
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "name": name.value,
                "price": price.value,
                "staff": staff.value,
                "nameStaff": nameStaff.value,
                "date": date.value
            })
    }
    const rawResponse = await fetch("/addData", options)
    const content = await rawResponse.json()
    loading(false)
    if (content.status) {
        alert("ជោគជ័យ!!!")
        name.value = ""
        price.value = ""
        staff.value = "1"
        nameStaff.value = "Chhi"
        date.value = ""
    } else {
        alert("បរាជ័យ!!!")
    }
}

async function login() {
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    var msg = document.getElementById('msg')
    var isFalse = false

    if (!username.value.trim()) {
        username.classList.add('error');
        isFalse = true
    } else {
        username.classList.remove('error')
    }
    if (!password.value.trim()) {
        password.classList.add('error');
        isFalse = true
    } else {
        password.classList.remove('error')
    }

    if (isFalse) {
        return
    }
    loading(true)
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "username": username.value,
                "password": password.value
            })
    }
    const rawResponse = await fetch("/login", options)
    const content = await rawResponse.json()
    loading(false)
    msg.innerHTML = ""
    switch (content.status) {
        case "IU":
            msg.innerHTML = "ឈ្មោះ​អ្នកប្រើប្រាស់​មិន​ត្រឹមត្រូវ"
            break
        case "IP":
            msg.innerHTML = "ពាក្យសម្ងាត់មិនត្រឹមត្រូវ"
            break
        case "SC":
            // alert("Success")
            setCookie("login", content.username, 30);
            getProfileUser(getCookie('login'))
            navigataTo('/')
            break
        default:
            msg.innerHTML = "Error"
    }
}

function loading(e) {
    if (e) document.getElementById('loading').style.display = '';
    else document.getElementById('loading').style.display = 'none';
}

getProfileUser(getCookie('login'))
async function getProfileUser(username) {
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username
        })
    }
    const res = await fetch("/getProfileUser", options)
    const content = await res.json()

    document.getElementById('profile1').src = content.profile
    document.getElementById('profile2').src = content.profile

    if (!content.name) return
    document.getElementById('name1').innerHTML = content.name
    document.getElementById('name2').innerHTML = content.name
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//disable right click web
document.addEventListener('contextmenu', event => event.preventDefault());



//function copy text
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'ជោគជ័យ' : 'បរាជ័យ';
        alert("ការចម្លងតំណរសម្រាប់អ្នកបាន" + msg)
    } catch (err) {
        alert('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        alert("ការចម្លងតំណរសម្រាប់អ្នកបានជោគជ័យ")
    }, function (err) {
        alert('Async: Could not copy text: ', err);
    });
}