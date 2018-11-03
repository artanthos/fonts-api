import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import _ from './utils';


const app = express(),
    port = 5000,
    entriesPerPage = 10,
    key = `YOUR_API_KEY_GOES_HERE`,
    GGL_ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`,
    fontsJSON = `files/fonts.json`;

app.get('/', app.use('/', express.static('./client/')));
app.get('/error', (req, res) => {
    res.send('error');
});


// servesc dinamic, in functie de ce request am
app.get('/api/getJson', (req, res) => {

    let path = req.query.file === 'all' ?
        fontsJSON :
        `files/${req.query.file}.json`;

    let getJson = _.serveJson(path);

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify(getJson.file));
});

// search
app.get('/api/filter', (req, res) => {

    let path = fontsJSON,
        keyword = req.query.keyword.toLowerCase(),
        getJson = _.serveJson(path);

    let results = getJson.array[1][0].filter(item => {
        return item.family.toLowerCase().includes(keyword);
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify(results));
});

// in functie de valoarea lui entriesPerPage, sparg fonts.json in mai multe bucati
// motivul este simularea unui DB cu un numar de entriesPerPage
app.get('/paginate', (req, res) => {
    let fonts = fs.readFileSync(fontsJSON);
    fonts = JSON.parse(fonts);

    // convertesc in array sa pot sa sparg in mai multe bucati in pasul urmator
    let fontsArray = Object.keys(fonts.items).map( key => {
        return fonts.items[key];
    });

    // algo simplu care sparge fonts.json in mai multe bucati
    // bazat pe entriesPerPage care e definit mai sus
    let chunks = _.chunkArray(fontsArray, fontsArray.length / entriesPerPage);

    chunks.map((item, index) => {
        fs.writeFileSync(`./files/fonts_${parseInt(index)+1}.json`, JSON.stringify(item));
    })

    // ca sa-mi tin o evidenta anumarului total de fonturi,
    // sa nu mai trebuiasca sa queryez de fiecare data;
    fs.writeFileSync(`./files/totalNumberOfFonts.json`, JSON.stringify({
        total: fontsArray.length
    }))

    res.send("done");
});

// fetch din ggl fonts api
app.get('/getFontsFromGoogleApi', (req, res) => {

    fetch(GGL_ENDPOINT)
        .then(res => res.json())
        .then(data => {
            fs.writeFileSync(`./files/${fontsJSON}`, JSON.stringify(data));
            res.send(
                data.items
            );
        })
        .catch(err => {
            res.redirect('/error');
        });

});



app.listen(port, (err) => {
    if (err) {
        console.log(err);
    };
    console.log('http://localhost:' + port);
});