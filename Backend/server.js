const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
const knex = require('knex');

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'qwertyuiop',
    database : 'blogs'
  }
});

app.use(cors());

app.get('/wall',(req,res)=>{
  db.select('*')
  .from('blogs')
  .orderBy('joined','desc')
  .limit(1)
  .then(data=>{
    console.log(data);
  })
})

app.post('/newblog',(req,res)=>{
  const {data,date} = req.body;
  db('blogs')
  .returning('*')
  .insert({
    content:data,
    joined:date
  })
  .then(data=>{
    res.json(data);
  })
  .catch(err => res.status(400).json('cant process request'))
})

app.post('/register',(req,res)=>{
  const { username, name, password } =req.body;
  db('users')
  .returning('*')
  .insert({
    name:name,
    username:username,
    password:password
  })
  .then(user =>{
    res.status(200).json('success');
  })
  .catch(err => res.status(400).json('user already exists'))
})

app.post('/signin',(req,res)=>{
  const {username,password}=req.body;
  if(username.length!=0&&password.length!=0){
  db.select('*').from('users')
  .where({username,password})
  .then(user=>{
    if(user.length)
    res.status(200).json(user);
    else
     res.status(400).json('Invalid useer'); 
  })}
  else
    res.json('please enter valued');
})

app.get('/',(req,res)=>{
  res.send('this is workin');
})

app.listen(3000,()=>{
  console.log('app is running');
})


