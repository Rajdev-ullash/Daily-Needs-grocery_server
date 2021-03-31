const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0wlb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("dailyNeeds").collection("products");
    const ordersCollection = client.db("dailyNeeds").collection("orders");
    // perform actions on the collection object


    app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.get('/product/:id', (req, res) =>{
        // const id = ObjectID(req.params.id);
        // console.log(req.params.id);
        productsCollection.find({_id: req.params.id})
        .toArray((err, documents) =>{
            res.send(documents)
      })
    })


    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product: ', newProduct);
        productsCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })



    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('deleted id', id)
        productsCollection.findOneAndDelete({_id: id})
        .then(result => 
            {result.deletedCount > 0})
            
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/info', (req, res) => {
        console.log(req.query.email);
        ordersCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

});





app.listen(process.env.PORT || port);