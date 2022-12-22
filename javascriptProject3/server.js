//Group Assignment, Group 3 Members: Aibiike Omurzakova,  Phuong Uyen Dang, Seda Dadak
 
let express = require('express');
let app = express();
const queries = require('./mysql/queries');
app.listen(3000);
const mysql = require('./mysql/config')
const {querySql}=require('./mysql/queries');
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", (request, response) => {
  response.render('index', { title: 'Express' });
  
});
//Showing table without any filter 
app.get("/first", (request, response) => {
  let con = mysql.getCon();
  con.connect();
  let query= `SELECT name, country, city, cuisine FROM restaurants ORDER BY name LIMIT ?,?`
  let take = parseInt(request.query.take);
  let skip = parseInt(request.query.page)*take;
  query=mysql.functions.format(query, [skip,take]);
  con.query(query,(error,result)=>
    {response.json(result)});
  con.end();  
});

//To put the data inside second filter we made promise all for three queries
app.get("/promiseAll",(request, response) => {
  
  let cityQuery =querySql(`SELECT DISTINCT (city) FROM restaurants ORDER BY city`);
  let countryQuery = querySql(`SELECT DISTINCT (country) FROM restaurants ORDER BY country`);
  let cuisineQuery =querySql(`SELECT DISTINCT (cuisine) FROM restaurants ORDER BY cuisine`);
  Promise.all([cityQuery, countryQuery, cuisineQuery]).then(result=>{
    response.json({
      "city":result[0],
      "country":result[1],
      "cuisine":result[2]
    });
  });
});

//To send data when we applying filter
app.get("/applyFilter", (request, response)=>{
  let sortBy = request.query.sortBy;
  let criteria = request.query.criteria;
  let query= `SELECT * FROM restaurants WHERE ${sortBy} = "${criteria}" ORDER BY name LIMIT ?,?`;
  let take = parseInt(request.query.take);
  let skip = parseInt(request.query.page) * take; 
  query=mysql.functions.format(query, [skip,take]);
  querySql(query).then(result=>{
    response.json(result);
  })
});
//Count the data and fetch the result for pagination
app.get("/countFilter", (request, response)=>{
  let con = mysql.getCon();
  con.connect()
  let sortBy = request.query.sortBy;
  let criteria = request.query.criteria;
  let query = `Select count(*) as total FROM restaurants WHERE ${sortBy} = "${criteria}" ORDER BY name `;
  
  querySql(query).then(result=>{
    response.json(result);
  })
  con.end(); 

})



