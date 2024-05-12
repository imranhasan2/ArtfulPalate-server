const express = require ('express')
const app =express()
const cors = require ('cors')

const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


app.get('/',(req,res) =>{
    res.send('artfulPalate server is running')
})

app.listen(port,() =>{
    console.log(`artful palate is running port : ${port}`)
})