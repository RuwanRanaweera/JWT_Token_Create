const mongoose = require('mongoose');
const dbConnect = () =>{
    const connectionParams ={useNewUrlParser:true};
    mongoose.connect(process.env.DB, connectionParams);
    mongoose.connection.on('connected', ()=>{
        console.log('Connected to Database Successfully');
        
});
mongoose.connection.on('error', (err)=>{
    console.log('Error connecting to Database : ' + err);
    
});

mongoose.connection.on('disconnected', ()=>{
    console.log('Mongoose connection disconnected');
    
});
};

module.exports = dbConnect;