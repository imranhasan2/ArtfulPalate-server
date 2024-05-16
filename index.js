const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhkveen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const foodCollection = client.db('foodCollectionDb').collection('addFood')

        const purchaseCollection = client.db('foodCollectionDb').collection('purchase')
        const photoGallery = client.db('foodCollectionDb').collection('photo')


        app.post('/addFood', async (req, res) => {
            const item = req.body;

            const result = await foodCollection.insertOne(item)
            res.send(result)

        })

        app.get('/addFood', async (req, res) => {

            const query = foodCollection.find()
            const result = await query.toArray()
            res.send(result)
        })

        app.get('/addFood/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query)
            res.send(result)

        })


        // photo


        app.post('/photo',async(req,res) => {
            const photo =req.body;
           
            const result = await photoGallery.insertOne(photo)

            res.send(result)

        })

        app.get('/photo',async(req,res) => {
            const photo =req.body;
            const result = await photoGallery.find(photo).toArray()

            res.send(result)
        })




        // foodPurchase Page

        app.post('/purchase', async (req, res) => {
            const purchase = req.body;
            const id = purchase._id;
            const result = await purchaseCollection.insertOne(purchase)

            await foodCollection.updateOne(
                { _id: id }, { $inc: { orderCount: 1 } }
            )
            res.send(result)

        })



        app.get('/purchase', async (req, res) => {
            const topFoods = await foodCollection.find().sort({ orderCount: -1 })
            .limit(6)
            .toArray()

               

            res.send(topFoods)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('artfulPalate server is running')
})

app.listen(port, () => {
    console.log(`artful palate is running port : ${port}`)
})