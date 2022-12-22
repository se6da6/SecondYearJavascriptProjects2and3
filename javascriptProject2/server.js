const express = require('express');
const queries = require('./mysql/queries');
const app = express();
const mysql = require('./mysql/config')
app.set('view engine', 'ejs');
app.listen(3000);



app.get('/', function(request, response) {
  response.render('index', { title: 'Express' });
});

app.get('/states', (request, response) => {
 
 let con = mysql.getCon();
 con.connect();

 con.query("SELECT * from states ORDER BY name", (error, result)=>{
   response.json(result);
  })
  
});

app.get('/cities', (request, response) =>{
  const states = request.query.states;
  
  let con = mysql.getCon();
  con.connect();
  con.query("SELECT * from cities WHERE state_id='"+states+"' ORDER BY name", (error, result)=>{
    response.json(result);
  });
  con.end();
});



app.get('/airbnb/hotel/:id', (request, response) => {
  
  let place_id = request.params.id
  let con = mysql.getCon();
  con.connect();
  con.query("SELECT * from places WHERE id='"+place_id+"'", (error, result)=>{    
    response.render('airbnb', { title:'AirBnb', result: result[0]});      
  });
  con.end();
});

app.get('/airbnb/find-one', (request, response) => {
  let con = mysql.getCon();
  con.connect();
  let bedrooms = request.query.bedrooms
  let guests = request.query.guests
  let priceNight = request.query.priceNight
  let amenities = request.query.amenities
  
  queries.findListing(
    { 
      number_rooms: bedrooms,
      amenities: amenities,
      guests:guests,
      priceNight:priceNight
      
    }).then(result => {
      if(result.length>0){
        response.render("listing", { listing: result[0] });
      }
      else{
        response.render("listings_no_data");
      }
               
    });;
 
  con.end();
}); 


app.get ("/airbnb/find-many", async (request, response) => {
  let con = mysql.getCon();;
  con.connect();
  const bedrooms = request.query.bedrooms
  const state = request.query.state
  const city = request.query.city
  console.log("city", city)
  queries.findListings(
    { 
      number_rooms: bedrooms,
    }).then(result => {
      
      let hotelsInCity = []
      for(const row in result){
        if(city===result[row].city_id ){
          hotelsInCity.push(result[row])
        }
      }
      if(hotelsInCity.length > 0 ){
        response.render("listings", { listings: hotelsInCity });
      }
      else{
        response.render("listings_no_data");
      }      
    });;
});


