const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { URL_DB, Token_DB, Table_User_DB, Table_Data_DB } = require("./data");

const app = express();
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'frontend')));
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 80, () => console.log("Server is running...!"));

app.get('/listData', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    const { data, error } = await db.from(Table_Data_DB).select("*").order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/listDataTesting', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    const { data, error } = await db.from("dataTesting").select("*").order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getProfileUser', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    const { data, error } = await db.from(Table_User_DB).select('*').eq("username", "pozzseang");
    if (error) throw error;
    res.json(data[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addData', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    await db.from(Table_Data_DB).insert([{
      name: req.body.name,
      price: req.body.price,
      staff: req.body.staff,
      namestaff: req.body.nameStaff,
      date: req.body.date.split("-").reverse().join("-")
    }]);
    res.json({ "status": true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    const { data, error } = await db.from(Table_User_DB).select('*').eq("username", req.body.username);
    if (error) throw error;
    if (data[0]) {
      if (data[0].password === req.body.password) {
        return res.json({ "status": "SC", "username": data[0].username });
      } else {
        return res.json({ "status": "IP" });
      }
    } else {
      return res.json({ "status": "IU" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/getProfileUser', async (req, res) => {
  try {
    const db = createClient(URL_DB, Token_DB);
    const { data, error } = await db.from(Table_User_DB).select('*').eq("username", req.body.username);
    if (error) throw error;
    res.json(data[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'index.html'));
});
