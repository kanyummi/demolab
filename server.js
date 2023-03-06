// server.js
//console.log('May Node be with you')

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient
const  ObjectID = require('mongodb').ObjectId;

const connectionString = 'mongodb+srv://kanyummi:blader2003@cluster0.fqlgflv.mongodb.net/?retryWrites=true&w=majority'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        // (1a) CREATE: client -> create -> database -> 'star-wars-quotes'
        // -> create -> collection -> 'quotes'
        const db = client.db('Toy')
        const quotesCollection = db.collection('products')
        // To make the 'public' folder accessible to the public
        app.use(express.static('/public'))

        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs')

        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))


        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'quotes' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('products').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)

                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { toys: results })
                })
                .catch(/* ... */)
        })

        app.get('/products', (req, res) => {
            db.collection('products').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)

                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('product.ejs', { toys: results })
                })
                .catch(/* ... */)
        })

        app.get('/add', (req, res) => {
            res.render('add.ejs')
        })

        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/quotes' -> collection -> insert -> result
        app.post('/save', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {

                    // results -> server -> console
                    console.log(result)

                    // -> redirect -> '/'
                    res.redirect('/');
                })
                .catch(error => console.error(error))
        })

        app.get('/delete/:id', (req, res) => {
            let id = req.params.id
            quotesCollection.deleteOne({ _id: new ObjectID(id) })
                .then(result => {

                    // results -> server -> console
                    console.log(result)

                    // -> redirect -> '/'
                    res.redirect('/');
                })
                .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function () {
            console.log('listening on 3000')
        })
    })


