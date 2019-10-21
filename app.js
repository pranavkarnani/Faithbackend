//https://developers.zomato.com/api/v2.1/cuisines?city_id=280&api_key=7d20f0240775fc51cd36e733e07c53d5
const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const request = require('request');

app.get("/zomato/:lat/:lon", function (req, response) {

  request({
    url: 'https://developers.zomato.com/api/v2.1/geocode',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'user-key': '7d20f0240775fc51cd36e733e07c53d5'
    },
    qs: {
      lat: req.params.lat,
      lon: req.params.lon
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 7; i++) {
        myjson.mydata[i] = {
          name: n.nearby_restaurants[i].restaurant.name,
          address: n.nearby_restaurants[i].restaurant.location.address,
          cuisines: n.nearby_restaurants[i].restaurant.cuisines,
          rating: n.nearby_restaurants[i].restaurant.user_rating.aggregate_rating,
          menu: n.nearby_restaurants[i].restaurant.menu_url
        }
      }
      response.json(myjson);
    }
  });
});


//YOUTUBE SEARCH API
app.get("/youtube/:query", function (req, response) {

  request({
    url: 'https://www.googleapis.com/youtube/v3/search',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    qs: {
      part: 'snippet',
      q: req.params.query,
      type: 'video',
      key: 'AIzaSyAahnWoe2y3Yv_d_ChMzXCbRSK-lhJiYtU'
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 4; i++) {
        myjson.mydata[i] = {
          videoid: n.items[i].id.videoId,
          description: n.items[i].snippet.description
        }
      }
      response.json(myjson);
    }
  });
});

//GOOGLE PLACES API
app.get("/places/:lat/:lon/:name/:type", function (req, response) {

  request({
    url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    qs: {
      location: req.params.lat + ',' + req.params.lon,
      radius: 500,
      name: req.params.name,
      type: req.params.type,
      key: 'AIzaSyAahnWoe2y3Yv_d_ChMzXCbRSK-lhJiYtU'
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 4; i++) {
        myjson.mydata[i] = {
          name: n.results[i].name,
          address: n.results[i].vicinity
        }
      }
      response.json(myjson);
    }
  });
});


app.get("/music/:artist", function (req, response) {
  console.log("handler");
  request({
    url: 'https://deezerdevs-deezer.p.mashape.com/search',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Mashape-Key': '8qIyxAfODPmshXIRcQhrejoki96Fp14qI6RjsnUxoUgjlQyUKX'
    },
    qs: {
      q: req.params.artist
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 5; i++) {
        myjson.mydata[i] = {
          title: n.data[i].title,
          preview: n.data[i].preview,
          artist: n.data[i].artist.name,
          image: n.data[i].album.cover_medium
        }
      }
      response.json(myjson);
    }
  });
});

app.get("/quotes", function (req, response) {

  request({
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-Mashape-Key': '8qIyxAfODPmshXIRcQhrejoki96Fp14qI6RjsnUxoUgjlQyUKX'
    },
    qs: {
      cat: 'famous',
      count: '10'
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      console.log(body);
    }
    var n = JSON.parse(body);
    var myjson = [];
    for (var i = 0; i < n.length; i++) {
      var x = n[i];
      myjson.push(
        {
          quote: x.quote,
          author: x.author
        }
      )
    }
    response.json(myjson);
  });


});

//OUtDOORS locations recoomendations

app.get("/four/:near", function (req, response) {

  request({
    url: 'https://api.foursquare.com/v2/venues/explore',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json'
    },
    qs: {
      client_id: '05SHK2C0014AEMGL3FIFPKAMT505ZQT2Q0VYIQC5RRHW4LUG',
      client_secret: 'GE42GZQJYK12I5UNSBRUBTBF42GYAGDAHDI314QRM2JM4HZI',
      //ll: '40.7243,-74.0018',
      //query: 'coffee',
      near: req.params.near,
      section: 'outdoors',
      v: '20170801',
      limit: 10
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 5; i++) {
        myjson.mydata[i] = {
          name: n.response.groups[0].items[i].venue.name,
          address: n.response.groups[0].items[i].venue.location.crossStreet,
          tips: n.response.groups[0].items[i].tips[0].text
        }
      }
      response.json(myjson);
    }
  });


});

//SEARCH for a venue near and a query

app.get("/four/:near/:query", function (req, response) {
  request({
    url: 'https://api.foursquare.com/v2/venues/search',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json'
    },
    qs: {
      client_id: '05SHK2C0014AEMGL3FIFPKAMT505ZQT2Q0VYIQC5RRHW4LUG',
      client_secret: 'GE42GZQJYK12I5UNSBRUBTBF42GYAGDAHDI314QRM2JM4HZI',
      // ll: 'req.params.lat,req.params.lon',
      near: req.params.near,
      query: req.params.query,
      v: '20170801',
      intent: 'global',
      limit: 10
    }
  }, function (err, res, body) {
    if (err) {
      console.error(err);
    } else {
      var n = JSON.parse(body);
      var myjson = { mydata: [] }
      for (i = 0; i < 5; i++) {
        myjson.mydata[i] = {
          name: n.response.venues[i].name,
          address: n.response.venues[i].location.address,
          place: n.response.venues[i].categories[0].name
        }
      }
      response.json(myjson);
    }
  });
});

let collection = new Sockets();

io.sockets.on('connection', function (socket) {
  console.log('Connected - ' + socket.id);
  collection.add(socket);
});

app.post('/', function (req, res) {
  console.log("POST request received.");
  console.log(req.body);
  const paramReceived = req.body.queryResult.action;
  if (paramReceived.includes("music")) {
    var type = req.body.queryResult.parameters.music;
    if (type === "music") {
      type = "rock";
    }
    request({
      url: 'https://deezerdevs-deezer.p.mashape.com/search',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Mashape-Key': '8qIyxAfODPmshXIRcQhrejoki96Fp14qI6RjsnUxoUgjlQyUKX'
      },
      qs: {
        q: type
      }
    }, function (err, res, body) {
      if (err) {
        console.error(err);
      } else {
        var n = JSON.parse(body);
        var myjson = { mydata: [] }
        for (i = 0; i < n.data.length; i++) {
          myjson.mydata.push( {
            title: n.data[i].title,
            preview: n.data[i].preview,
            artist: n.data[i].artist.name,
            image: n.data[i].album.cover_medium
          });
        }
        console.log(myjson);
        collection.emit('emit', { message: myjson });
      }
    });
  }

  else if (paramReceived.includes("places")) {
    var x = req.body.queryResult.parameters.places.toLowerCase();
    console.log(x);
    if(x === "places") {
      x = "cafe";
    }
    request({
      url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      qs: {
        location: "12.91,79.13",
        radius: 5000,
        name: x,
        type: x,
        key: 'AIzaSyAahnWoe2y3Yv_d_ChMzXCbRSK-lhJiYtU'
      }
    }, function (err, res, body) {
      if (err) {
        console.error(err);
      } else {
        var n = JSON.parse(body);
        var myjson = { mydata: [] }
        for (i = 0; i < n.results.length; i++) {
          myjson.mydata.push({
            name: n.results[i].name,
            image: n.results[i].icon,
            address: n.results[i].vicinity
          });
        }
        console.log(myjson);
        collection.emit('emit', { message: myjson });
      }
    });
  }

  else if (paramReceived.includes("quotes")) {
    console.log("quotes");
    var n;
    request({
      url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Mashape-Key': '8qIyxAfODPmshXIRcQhrejoki96Fp14qI6RjsnUxoUgjlQyUKX'
      },
      qs: {
        cat: 'famous',
        count: '10'
      }
    }, function (err, res, body) {
      if (err) {
        console.error(err);
      } else {
        n = JSON.parse(res.body);
      }
      console.log(n);
      collection.emit('emit', { message: n });
    });
  }
})

router.get('/sockets', function (req, res) {
  let file_path = path.join(__dirname, '..', 'index.html');
  res.sendFile(file_path);
});

function Sockets() {
  this.list = [];
}

Sockets.prototype.add = function (socket) {
  this.list.push(socket);

  let self = this;
  socket.on('disconnect', function () {
    self.remove(socket);
  });
}

Sockets.prototype.remove = function (socket) {
  let i = this.list.indexOf(socket);
  if (i != -1) {
    this.list.splice(i, 1);
  }
}

Sockets.prototype.emit = function (name, data, except) {
  let i = this.list.length;
  while (i--) {
    if (this.list[i] != except) {
      this.list[i].emit(name, data)
    }
  }
}

server.listen(8000, function () {
  console.log('Socket server running succesfully on port 8001');
});

app.listen(process.env.PORT || 8001);
console.log(`You are curently listening the port 8000`);