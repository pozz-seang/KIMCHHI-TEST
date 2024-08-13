

const navigataTo = url => {
    history.pushState(null, null, url)
    router()
}

const router = async () => {

    const routes = [
        { path: "/", view: () => AllScreenShow("home") },
        { path: "/login", view: () => AllScreenShow("login") },
        { path: "/addMore", view: () => AllScreenShow("addMore") },
        { path: "/aboutDev", view: () => AllScreenShow("aboutDev") },
        { path: "/onlyView", view: () => AllScreenShow("onlyView") },
        // { path: "/signout", view: () => { signout() } }
    ]

    const potentialMatches = routes.map(route => {
        return {
            route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatches => potentialMatches.isMatch)

    if (!match) {
        match = {
            route: { path: "/", view: () => AllScreenShow("home") },//set error 404 page
            isMatch: true
        }
        history.pushState(null, null, "/")
    }

    match.route.view()
}



document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener('click', e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            navigataTo(e.target.href)
            showBar()
            if (getCookie("login") == '') {
                navigataTo('/login')
            }
        }
    })

    if (location.pathname == "/onlyView") {
    } else if (getCookie("login") == '') {
        navigataTo('/login')
    }


    router()
})

function AllScreenShow(screen) {
    loading(true)
    //screen
    var login = document.getElementById('login')
    var home = document.getElementById('home')
    var addMore = document.getElementById('addMore')
    var aboutDev = document.getElementById('aboutDev')

    login.style.display = "none"
    home.style.display = "none"
    addMore.style.display = "none"
    aboutDev.style.display = "none"
    header(false)

    //list
    var Ldashboard = document.getElementById("Ldashboard")
    var LaddMore = document.getElementById("LaddMore")
    var Labout = document.getElementById("Labout")
    var Lsignout = document.getElementById("Lsignout")

    //set title
    var title = document.getElementById('title')

    Ldashboard.classList.remove("select")
    LaddMore.classList.remove("select")
    Labout.classList.remove("select")
    Lsignout.classList.remove("select")

    switch (screen) {
        case "login":
            if (getCookie("login") != '') {
                navigataTo('/')
                AllScreenShow("home")
                break
            }
            login.style.display = ""
            document.title = "ចូល"
            loading(false)
            break
        case "home":
            getDataTable()
            home.style.display = ""
            Ldashboard.classList.add("select")
            document.title = "ទំព័រដើម"
            title.innerHTML = "ទំព័រដើម"
            header(true)
            break
        case "addMore":
            addMore.style.display = ""
            LaddMore.classList.add("select")
            document.title = "បន្ថែម​ទៀត"
            title.innerHTML = "បន្ថែម​ទៀត"
            header(true)
            loading(false)
            var name = document.getElementById("name")
            var price = document.getElementById("price")
            var staff = document.getElementById("staff")
            var nameStaff = document.getElementById("nameStaff")
            var date = document.getElementById("dates")
            name.value = ""
            price.value = ""
            staff.value = "1"
            nameStaff.value = "Chhi"
            date.value = ""
            name.classList.remove('error')
            price.classList.remove('error')
            staff.classList.remove('error')
            nameStaff.classList.remove('error')
            date.classList.remove('error')

            break
        case "aboutDev":
            aboutDev.style.display = ""
            Labout.classList.add("select")
            document.title = "ABOUT THE DEVELOPER"
            title.innerHTML = "DEVELOPER"
            header(true)
            loading(false)
            break
        case "onlyView":
            home.style.display = ""
            document.title = "មើលតែប៉ុណ្ណោះ"
            title.innerHTML = "មើលតែប៉ុណ្ណោះ"
            getDataTable()
            header(true)
            break
    }
}

function loading(e) {
    if (e) document.getElementById('loading').style.display = '';
    else document.getElementById('loading').style.display = 'none';
}

function header(e) {
    var btnBar = document.getElementById("btnBar")
    var slideBar = document.getElementById("slideBar")
    var header = document.getElementById("header")

    if (e) {
        btnBar.style.display = ""
        slideBar.style.display = ""
        header.style.display = ""
    } else {
        btnBar.style.display = "none"
        slideBar.style.display = "none"
        header.style.display = "none"
    }

    if (!getCookie("login")) {
        btnBar.style.display = "none"
        slideBar.style.display = "none"
    }
}

function getDataTable() {
    //on loading
    loading(true)
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {

        const fee = 0.2 // 20%

        var dataTable = ""
        var totalPrice = 0
        var totalFee = 0
        var data = JSON.parse(this.response)

        for (var key in data) {

            dataTable += `
            <li>
                <div>
                    <p id="id">No. #SC${data[key].id}</p>
                    <p id="date">${data[key].date.split("-").join("/")}</p>
                </div>
                <hr>
                <div>
                    <div>
                        <p class="t">សេវាកម្ម</p>
                        <p>${data[key].name}</p>
                    </div>
                    <div>
                        <p class="t">តម្លៃ</p>
                        <p>${data[key].price}$</p>
                    </div>
                    <div>
                        <p class="t">កម្រៃ</p>
                        <p>${(data[key].price * fee / data[key].staff).toLocaleString()}$</p>
                    </div>
                <div class="stuff">
                    <p class="t">បុគ្គលិក</p>
                    <p>${data[key].namestaff} (${data[key].staff})</p>
                </div>
                </div>

            </li>
            `

            totalPrice += data[key].price
            totalFee += data[key].price * fee / data[key].staff
        }


        document.getElementById('income').innerHTML = "$ " + new Intl.NumberFormat().format(totalPrice)
        document.getElementById('profit').innerHTML = "$ " + new Intl.NumberFormat().format(totalFee)
        // document.getElementById("dataAllTransitioons").innerHTML = dataTable
        document.getElementById("list-data").innerHTML = dataTable

        //off loading
        loading(false)
    }
    xhttp.open("GET", "/listData", true);
    xhttp.send();
}

function signout() {
    if (confirm("តើអ្នកពិតជាចង់ចាកចេញ?")) {
        setCookie("login", "", -10)
        navigataTo('/login')
    }
}
