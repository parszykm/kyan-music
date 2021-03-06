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
        data.data.tracks.items.forEach((item,index) => {
            results.push({
                artist: item.artists[0].name,
                key: item.id,
                uri:item.uri,
                image: item.album.images[0].url,
                track_name: item.name,
                album_name: item.album.name,
                offset: index,
                time: new Date(parseInt(item.duration_ms)).toISOString().slice(14,19),


            })
        


    })
    res.json(results)
}).catch(err => {console.log(err), res.sendStatus(400)})
})

app.post('/play', (req, res) => {
    const uri=req.body.uri
    const device_id=req.body.device_id
    const access_token=req.body.accessToken
    const offset = req.body.activeOffset
    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,{"uris":JSON.parse(uri), "offset": { "position": offset }, },
    {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+access_token
        }
    }

    ).then(data => res.sendStatus(200))
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
        // res.json(err)
    })
})
app.post('/stop', (req, res) => {
    const device_id=req.body.device_id
    const access_token=req.body.accessToken
    axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,{},
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
app.post('/resume', (req, res) => {
    const device_id=req.body.device_id
    const access_token=req.body.accessToken
    axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,{},
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
app.post('/add', (req,res) => {
    const accessToken = req.body.accessToken
    const id = req.body.id
    axios.put(`https://api.spotify.com/v1/me/tracks?ids=${id}`,{"ids": [id]},
    {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+accessToken
        }
    }
    ).then(data =>  console.log(data)).catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})
app.post('/favorites', (req, res) => {
    const results =[]
    const accessToken = req.body.accessToken
    axios.get('https://api.spotify.com/v1/me/tracks?limit=50',{ 
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
    }
    }).then(async (data) =>{
        
        // console.log(data.data.items.length)
        var offset = data.data.items.length
        var total = data.data.total

        data.data.items.forEach((item,index) => {
            results.push({
                artist: item.track.artists[0].name,
                key: item.track.id,
                uri:item.track.uri,
                image: item.track.album.images[0].url,
                track_name: item.track.name,
                album_name: item.track.album.name,
                offset: index,
                time: new Date(parseInt(item.track.duration_ms)).toISOString().slice(14,19) 



            })
        


    })      
    while(offset < total)
    {
      
        // console.log(offset,total)
        await axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,{ 
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
        }
        }).then(data_next =>{  
            data_next.data.items.forEach((item) => {
                // console.log(item.track.name)
                results.push({
                    artist: item.track.artists[0].name,
                    key: item.track.id,
                    uri:item.track.uri,
                    image: item.track.album.images[0].url ? item.track.album.images[0].url : null,
                    track_name: item.track.name,
                    album_name: item.track.album.name,
    
    
                })
        }) 
    })
    offset += 50
    }
    res.json(results)
    })
    .catch(err =>{
        console.log(err)
        res.sendStatus(400)
    })
})
app.post('/shuffle', (req, res) => {
    const accessToken = req.body.accessToken
    const state = req.body.state
    const deviceID=req.body.device
    axios.put(`https://api.spotify.com/v1/me/player/shuffle?device_id=${deviceID}&state=${state}`,{}, {
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
    }
    }).then(res.sendStatus(200)).catch(err => console.log(err))

})
app.listen(3001)