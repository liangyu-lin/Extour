const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Tour = require('../models/tour');

response.cookie('cookie2', 'value2', {
    sameSite: 'none',
    secure: true
});

mongoose.connect('mongodb://localhost:27017/extour', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array)=> array[Math.floor(Math.random() * array.length)];

const seedDB = async ()=>{
    await Tour.deleteMany({});
for (let i = 0; i<50; i++){
    const random1000 =  Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*300) + 50
    const tour = new Tour({
        location: `${cities[random1000].city}, ${cities[random1000].province_name} `,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'https://reloadvisor.org/wp-content/uploads/2019/10/Canada-ReloAdvisor.org_.jpg',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam repellat explicabo magnam et vitae laboriosam nesciunt aliquam. Tempora corporis quod voluptas saepe et totam odit libero dignissimos consequatur, asperiores impedit.',
        price

    })

    await Tour.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close() ;
});
