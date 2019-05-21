const express = require('express');
const cors = require('cors');
const monk = require('monk');

const db = monk('localhost/fisher-app');
const fishDB = db.get('fishes');

const app = express();
app.use(cors());
app.use(express.json());


// server listen on 5000
app.listen('5000', () => {
    console.log('LISTENING ON 5000');
});


// handle GET request
app.get('/', (req, res) => {
    res.json({
        'message' : 'GET IS WORKING'
    });
});


// GET the fishDB
app.get('/fishes', (req, res) => {
    fishDB
        .find()
        .then(fishDB => {
            res.json(fishDB);
        });
});


// validate input
function isValidFish(fish) {
    return fish.username && fish.username.toString().trim() !== '' && fish.fishtype && fish.fishtype.toString().trim() !== '';
}


// handle POST request
app.post('/fishes', (req, res) => {
    if(isValidFish(req.body)) {
        const fish = {
            username : req.body.username.toString(),
            fishtype : req.body.fishtype.toString(),
            weight : req.body.weight.toString(),
            created: new Date()
        }
        console.log(fish);

        fishDB
            .insert(fish)
            .then(createdFish => {
                res.json(createdFish);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required!'
        });
    }
});
