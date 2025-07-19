var express=require('express');
var app=express();
app.use(express.static('public/'));
var adminRoute=require('./routes/admin');
var bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
var upload=require('express-fileupload');
app.use(upload()); 
var adminRoute=require('./routes/admin');
app.use("/admin",adminRoute);

const PORT = 2000;


const start = () => {
    try
    {
        app.listen(PORT , () => 
        {
            console.log(`Listening On Port ${PORT}`);
        })
    }
    catch (error)
    {
        console.log('Error => : ' , error)
    }
}

start();