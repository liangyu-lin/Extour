const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Tour = require('../models/tour');


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
for (let i = 0; i<300; i++){
    const random1000 =  Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*300) + 50
    const tour = new Tour({
        author: '5ffc32d826e4fa3b18aa9f88',
        location: `${cities[random1000].city}, ${cities[random1000].province_name} `,
        title: `${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam repellat explicabo magnam et vitae laboriosam nesciunt aliquam. Tempora corporis quod voluptas saepe et totam odit libero dignissimos consequatur, asperiores impedit.',
        price,
        geometry:{
            type:"Point",
            coordinates: [cities[random1000].lng, cities[random1000].lat]
        },
        images: [
                {
                   
                    url: 'https://res.cloudinary.com/dh1xlb7vs/image/upload/v1610487878/Extour/k1yxizye6usvr82raplt.jpg',
                    filename: 'Extour/k1yxizye6usvr82raplt'
                }, {
                  
                    url: 'https://res.cloudinary.com/dh1xlb7vs/image/upload/v1610487878/Extour/wswxdyla13kblvocirs7.jpg',
                    filename: 'Extour/wswxdyla13kblvocirs7'
                }, {
                    
                    url: 'https://res.cloudinary.com/dh1xlb7vs/image/upload/v1610487879/Extour/j8hmflrmrlduovrqclxu.jpg',
                    filename: 'Extour/j8hmflrmrlduovrqclxu'
                }

        ]

    })

    await tour.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close() ;
});
