const router = require('express').Router();


router.get('/',(req, res) =>{

    const user = req.user;
    res.json(user);
    // res.json([
    //     {
    //         "id":1,
    //         "name": "silva",
    //         "age":14
    //     },
    //     {
    //         "id":2,
    //         "name": "saman",
    //         "age":20
    //     }
    // ])
})



module.exports = router;