/*global console , $ , document*/
/*eslint-disable no-console*/
'use strict';
const express = require('express');
const bodyParser=require("body-parser");
const cors = require('cors');
const app = express();
const port = 3000;
const path=require('path');
const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://91.121.93.94:1883');
const mongoose=require('mongoose');
const User=require('./models/User');
let msg="";
var humdt2;

var tempe;
var humdt;
var datas;
var datas1;
var datas2;
var datas3;
var datas4;

var i=0;
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static('public'));
app.use('/api/User', User);
app.set('view engine','ejs');

mongoose.connect('mongodb+srv://kaplann:OVmdIOLoUqUeTN9x@cluster1.r6o0vrc.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', ()=>{
  console.log("MongoDB Connected!!!");
});
mongoose.connection.on('error',(err)=>{
  console.log("MongoDB error *XXXXX*",err);
})
client.on('connect', function () {
  
  client.publish('ledfan', msg);

  client.subscribe('temperature', function (err) {});
  client.subscribe('humidity', function (err) {});
  
  
})



client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic.toString()+":"+message.toString())
    let data=message.toString();
    data =JSON.parse(data);
    let values=parseInt(message.toString());
    var topic1=topic.toString();
    const user=new User({
      title: topic1,
      value: values
  });
  //client.publish('ledfan', msg);
  
  console.log(user);
  user.save();
  
})


// '/update-msg' yolunu işle
app.post('/update-msg', (req, res) => {
  const { value } = req.body;
  
  // msg değişkenini güncelle
  if (value === 'on') {
    msg = 'on';
  } else if (value === 'off') {
    msg = 'off';
  } else if (value === 'on1') {
    msg = 'on1';
  } else if (value === 'off1') {
    msg = 'off1';
  }
  console.log(msg);
  client.publish('ledfan', msg);

  res.sendStatus(200); // Başarılı yanıt dön
});

// app.get('/',(req,res)=> {
  
//   // User.find({title:"temperature"},{publishedAt:1,value:1,_id:0}).sort({ _id: -1 }).limit(5).then(data=>{
//   //   console.log(data);
//   //   tempe=data[0].value;
//   //     datas=data[0].value+ ' C° / ' +data[0].publishedAt.toLocaleDateString()+ ' // ' +data[0].publishedAt.toLocaleTimeString();
//   //     datas1=data[1].value+ ' C° / ' +data[1].publishedAt.toLocaleDateString()+ ' // ' +data[1].publishedAt.toLocaleTimeString();
//   //     datas2=data[2].value+ ' C° / ' +data[2].publishedAt.toLocaleDateString()+ ' // ' +data[2].publishedAt.toLocaleTimeString();
//   //     datas3=data[3].value+ ' C° / ' +data[3].publishedAt.toLocaleDateString()+ ' // ' +data[3].publishedAt.toLocaleTimeString();
//   //     datas4=data[4].value+ ' C° / ' +data[4].publishedAt.toLocaleDateString()+ ' // ' +data[4].publishedAt.toLocaleTimeString();
//   // }).catch((err)=>{
//   //   console.log(err);
//   // });
//   // User.find({title:"humidity"},{value:1,_id:0}).sort({ _id: -1 }).limit(1).then(data2=>{
//   //   console.log(data2); 
//   //    humdt=data2[0].value;
//   // }).catch((err)=>{
//   //   console.log(err);
//   // })
//   // console.log(humdt); 

//     res.render('index',{temp:tempe,data:datas,data1:datas1,data2:datas2,data3:datas3,data4:datas4 });
    

// });

app.get('/',(req,res)=> {
    res.render('index');
});

app.get('/kisiler', function (req, res) {
  User.find({title:"humidity"},{value:1,_id:0}).sort({ _id: -1 }).limit(1).then(data2=>{
    console.log(data2); 

     humdt2=data2;
  }).catch((err)=>{
    console.log(err);
  })

  res.json(humdt2);
});
app.get('/kisiler1', function (req, res) {
  User.find({title:"temperature"},{publishedAt:1,value:1,_id:0}).sort({ _id: -1 }).limit(5).then(data=>{
    console.log(data);
    tempe=data;
      }).catch((err)=>{
    console.log(err);
  });

  res.json(tempe);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



