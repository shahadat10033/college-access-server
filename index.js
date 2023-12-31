const express = require('express')
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ddxd88y.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
  },
  useNewUrlParser: true,
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect((err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    
    const collegesDbCollection = client.db("collegeDB").collection("colleges");
    const admissionFormDbCollection = client.db("FormDB").collection("forms");


app.get("/colleges", async(req,res)=>{

    const result = await collegesDbCollection.find().toArray();
    res.send(result);


})

app.get("/admission/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collegesDbCollection.findOne(query);
  res.send(result);
});

app.get("/popularColleges", async(req,res)=>{
    const limit=3
    const result = await collegesDbCollection.find().limit(limit).toArray();
    res.send(result);


})


app.get("/myColleges", async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }
  const result = await admissionFormDbCollection.find(query).toArray();

  res.send(result);
});
app.post("/admissionForm", async (req, res) => {
  const form = req.body;
  const result = await admissionFormDbCollection.insertOne(form);
  res.send(result);
});












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`college server running on port ${port}`)
})

