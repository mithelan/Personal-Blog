const express= require('express');
const mongoose = require("mongoose");

require("dotenv").config({ path: "src/.env" });

const app=express();


app.get('/',(req,res)=>
res.send('API')
);


//Routes
app.use('/api/users',require('./src/routes/api/users'));
/*app.use('/api/auth',require('./src/routes/api/auth'));
app.use('/api/profile',require('./src/routes/api/profile'));
app.use('/api/posts',require('./src/routes/api/posts'));*/






//Server
const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server started Boss ${PORT}`));


//Mongo
mongoose.connect(
    process.env.MONGO_DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("Happy Ji Mongo Vanthutu");
    }
);
