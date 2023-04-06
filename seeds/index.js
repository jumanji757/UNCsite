const mongoose = require('mongoose');
const players = require('./players');
const cities = require('./cities');
const { styles, dpositions } = require('./seedHelpers');
const Roster = require('../models/roster');
const Prospect = require('../models/prospect');

mongoose.set('strictQuery', true);
// can remove if need be

mongoose.connect('mongodb://localhost:27017/uncproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Roster.deleteMany({});
    for (let i = 0; i < 7; i++) {
        const random7 = Math.floor(Math.random() * 7);
        const random1000 = Math.floor(Math.random() * 1000)
        const rosNumber = Math.floor(Math.random() * 55);
        const rost = new Roster({
            author: '6400de2486bf9c84fbef2af8',
            name: `${players[random7].name}, ${players[random7].position}`,
            hometown: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(styles)} ${sample(dpositions)}`,
            class: `${players.class}`,
            number: rosNumber,
            images: [
                {
                  url: 'https://res.cloudinary.com/dsm8iidf8/image/upload/v1678561623/UNCROSTER/po4qrdnjij1xto2bmkpp.jpg',
                  filename: 'UNCROSTER/po4qrdnjij1xto2bmkpp',
                },
                {
                  url: 'https://res.cloudinary.com/dsm8iidf8/image/upload/v1678561623/UNCROSTER/tunxro5klpmssiwkjw3k.jpg',
                  filename: 'UNCROSTER/tunxro5klpmssiwkjw3k',
                }
              ],
        })
        await rost.save();
    }

}


const seedDB2 = async () => {
    await Prospect.deleteMany({});
    for (let i = 0; i < 7; i++) {
        const random7 = Math.floor(Math.random() * 7);
        const random1000 = Math.floor(Math.random() * 1000)
        const rosNumber = Math.floor(Math.random() * 55);
        const prospect = new Prospect({
            author: '6400de2486bf9c84fbef2af8',
            name: `${players[random7].name}, ${players[random7].position}`,
            hometown: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(styles)} ${sample(dpositions)}`,
            number: rosNumber,
            geometry:  {
              type: "Point",
              coordinates : [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dsm8iidf8/image/upload/v1678561623/UNCROSTER/po4qrdnjij1xto2bmkpp.jpg',
                  filename: 'UNCROSTER/po4qrdnjij1xto2bmkpp',
                },
                {
                  url: 'https://res.cloudinary.com/dsm8iidf8/image/upload/v1678561623/UNCROSTER/tunxro5klpmssiwkjw3k.jpg',
                  filename: 'UNCROSTER/tunxro5klpmssiwkjw3k',
                }
              ],
        })
        await prospect.save();
    }

}

seedDB2();

seedDB().then(() => {
    mongoose.connection.close();
});
