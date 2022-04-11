const dotenv = require('dotenv').config()
const express= require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const btoa = require('btoa');
const querystring=require('query-string');
const client_id=process.env.CLIENT_ID
const client_secret=process.env.CLIENT_SECRET
app.use(cors());
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.post('/token', (req,res) => {
    const code = req.body.code;
    
    axios.post('https://accounts.spotify.com/api/token',
    querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: 'http://localhost:3000'
    }),
    {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+btoa(client_id+':'+client_secret),

        }
        

    }).then(data => res.json({
        accessData: data.data.access_token,
        refreshToken: data.data.refresh_token,
        expiresIn: data.data.expires_in

    })).catch(err => {
        console.log(err)
        res.sendStatus(400);
    })
    
})
app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken
    axios.post('https://accounts.spotify.com/api/token'
    ,querystring.stringify({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
    })
    ,{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+btoa(client_id+':'+client_secret),

        }
        
    }).then(data => res.json({
        accessData: data.data.access_token,
        refreshToken: data.data.refresh_token,
        expiresIn: data.data.expires_in

    })).catch(err => {
        console.log(err)
        res.sendStatus(400);
    })

})
app.post('/profile', (req,res) => {
    const accessToken =req.body.accessToken
    axios.get('https://api.spotify.com/v1/me',{
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken, 
        }
    }).then(data => 
        {  
        res.json({
        name: data.data.display_name, 
        url: data.data.images[0].url
    })}
    )
    .catch(err => {console.log(err), res.sendStatus(400)})
})
app.post('/search', (req,res) => {
    console.log(req.body)
    const accessToken=req.body.accessToken
    const search_value=req.body.search_value

    axios.get('https://api.spotify.com/v1/search?'+querystring.stringify({
        q: search_value,
        type: 'track',
        limit: 15
    }), { 
        headers:
        {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        }
    }).then(data => {
        const results =[]
        // console.log(data.data.tracks.items[0].album)
        data.data.tracks.items.forEach((item) => {
            results.push({
                artist: item.artists[0].name,
                key: item.id,
                uri:item.uri,
                image: item.album.images[0].url,
                track_name: item.name,
                album_name: item.album.name,


            })
        


    })
    res.json(results)
}).catch(err => {console.log(err), res.sendStatus(400)})
})
app.post('/play', (req, res) => {
    const uri=req.body.uri
    const device_id=req.body.device_id
    const access_token=req.body.accessToken
    console.log(uri)
    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,{"uris":[`${uri}`]},
    {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+access_token
        }
    }

    ).then(data => res.sendStatus(200))
    .catch(err => {
        console.error(err)
        res.sendStatus(400)
    })
})
app.listen(3001)