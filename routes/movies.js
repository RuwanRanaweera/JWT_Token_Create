const router = require('express').Router();
const Movie = require("../models/Movie");
const jwt =require('jsonwebtoken');
const movies = require("../config/movies.json");
require('dotenv').config();
//const auth = require('../middleware/auth');

let refreshTokens=[]; 

router.post("/login",(req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const user={name:username,mail:email};
    const accessToken = jwt.sign(user,process.env.TOKEN_KEY,{expiresIn:'10s'});
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_KEY,{expiresIn:'24h'});
    refreshTokens.push(refreshToken);
    res.send({accessToken, refreshToken});
});

router.post('/token',(req, res)=>{
    const refreshToken = req.body.refreshToken;
    if(refreshToken == null){
        res.status(401);
    }
    if(!refreshToken.includes(refreshToken)){
        res.status(403);
    }
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY,(err, user)=>{
        if(err){
            res.status(403);
        }
        const accessToken = jwt.sign({name:user.name},process.env.TOKEN_KEY,{expiresIn:'10s'});
        res.send({accessToken});

    });

});

router.delete('/logout',(req, res) => {
    const refreshToken = req.body.refreshToken;
    refreshTokens =refreshTokens.filter(t=> t !==refreshToken );
    res.sendStatus(204);   
});



router.get("/movies",async(req, res)=>{
    try{
        const page = parseInt(req.query.page) -1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";

        const genreOptions = [
            "Action",
            "Romance",
            "Fantasy",
            "Drama",
            "Crime",
            "Adventure",
            "Thiller",
            "Sci-fi",
            "Music",
            "Family",
        ];

        genre === "All"
        ?(genre =[...genreOptions])
        :(genre = req.query.genre.split(","));
        req.query.sort? (sort=req.query.sort.split(",")): (sort=[sort]);
        let sortBy = {};
        if(sort[1]){
            sortBy[sort[0]] = sort[1];
        }else{
            sortBy[sort[0]] = "asc";
        }
        const movies = await Movie.find({name: {$regex :search , $options: "i"}})
        .where('genre')
        .in([...genre])
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);

        const total = await Movie.countDocuments({
            genre : {$in : [...genre]},
            name: {$regex:search, $options: "i"},

        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genre: genreOptions,
            movies,
        };
        res.status(200).json(response);

    }
    catch(err){
        console.error(err);
        res.status(500).json({error:true, message:"Internal Server Error"});
    }
});

// const insertMovies =async ()=> {
//     try{
//         const docs = await Movie.insertMany(movies);
//         return Promise.resolve(docs);
//     }catch (err){
//         return Promise.reject(err);
//     }
// };

// insertMovies()
//  .then((docs)=> console.log(docs))
//  .catch((err)=> console.log(err));



module.exports = router;