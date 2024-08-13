const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { URL_DB, Token_DB, Table_User_DB, Table_Data_DB } = require("./data");

const app = express()
var cors = require('cors');

// Auto Reload localhost
autoReloadPage()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'frontend')))
app.listen(process.env.PORT || 80, () => console.log("Server is running...!"))

app.use(express.json());
app.use(cors())


app.get('/listData', async (q, s) => {
  try {
    db = createClient(URL_DB, Token_DB)
    let { data, error } = await db.from(Table_Data_DB).select("*").order("id", { ascending: true })
    s.json(data)
  } catch (e) {
    console.log(e)
  }
})

//Testing data api

app.get('/listDataTesting', async (q, s) => {
  try {
    db = createClient(URL_DB, Token_DB)
    let { data, error } = await db.from("dataTesting").select("*").order("id", { ascending: true })
    s.json(data)
  } catch (e) {
    console.log(e)
  }
})
app.get('/getProfileUser', async (q, s) => {
  try {
    db = createClient(URL_DB, Token_DB)
    let { data, error } = await db.from(Table_User_DB).select('*').eq("username", "pozzseang")
    s.json(data[0])
  } catch (e) {
    console.log(e)
  }
})




app.post('/addData', async (q, s) => {

  try {
    db = createClient(URL_DB, Token_DB)
    await db.from(Table_Data_DB).insert([
      {
        name: q.body.name,
        price: q.body.price,
        staff: q.body.staff,
        namestaff: q.body.nameStaff,
        date: q.body.date.split("-").reverse().join("-")
      }
    ])
    s.json({ "status": true })
  } catch (e) {
    console.log(e)
  }

})


app.post('/login', async (q, s) => {
  try {
    db = createClient(URL_DB, Token_DB)
    let { data, error } = await db.from(Table_User_DB).select('*').eq("username", q.body.username)
    if (data[0]) {
      if (data[0].password === q.body.password) {
        return s.json({ "status": "SC", "username": data[0].username })
      } else {
        return s.json({ "status": "IP" })
      }
    } else {
      return s.json({ "status": "IU" })
    }

  } catch (e) {
    console.log(e)
  }
})

app.post('/getProfileUser', async (q, s) => {
  try {
    db = createClient(URL_DB, Token_DB)
    let { data, error } = await db.from(Table_User_DB).select('*').eq("username", q.body.username)
    s.json(data[0])
  } catch (e) {
    console.log(e)
  }
})

app.get('/*', (q, s) => {
  s.sendFile(path.resolve(__dirname, 'frontend', 'index.html'))
})



function autoReloadPage() {
  if (!process.env.PORT) {
    console.log('Auto Reload is runing')
    var livereload = require("livereload")
    var connectLiveReload = require("connect-livereload");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
        liveReloadServer.refresh("/");
      }, 100);
    });
    app.use(connectLiveReload());
  }
}