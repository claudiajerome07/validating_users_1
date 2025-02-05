const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose')
const cors=require('cors')
const bcrypt=require('bcrypt')
require('dotenv').config()

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());
app.use(express.json())

mongoose
  .connect(process.env.DB_URL)
  .then(()=>console.log('DB connected'))
  .catch((err)=>console.Console.log(err))

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  }
})
const User = mongoose.model('User', userSchema)

app.post('/post-user',async(req,res)=>{
  try{
    const {name,password,email}=req.body

    if(!email || !password || !name){
      return res.status(400).send({message:'All fields are required'})
    }

    const hashesPassword=await bcrypt.hash(password,10)

    const newUser= await User.create({name,password:hashesPassword,email})

    return res.status(201).send({ message:'registered Successfully'})
  }catch(err){
    return res.status(500).send({Error:err})
  }
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
