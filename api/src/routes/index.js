const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
const {Videogame,Gender}= require('../db.js')

const {API_KEY} = process.env

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


const getApiInfo = async () => {
    const apiUrl = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)
    const apiInfo = await apiUrl.data.map(el => {
        return {
            id:el.id, 
            name:el.name,
            image:el.background_image,
            genres:el.genres.map(e => {e.name}),
            rating:el.rating,
        };
    });
    return apiInfo;
};

const getDbInfo = async () => {
    const dbInfo = await Videogame.findAll({
        include:[{
           model: Gender,
           attributes:['name'],
           through:{attributes:[]},

        }]
    });
    return dbInfo;
}


const getAllVideogames = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const totalInfo = apiInfo.concat(dbInfo);
    return totalInfo;
}

router.get('/videogames', async (req,res,next) => {
    const name = req.query.name 
   let allVideogames = await getAllVideogames();
   if (name){
    let videogameName = await allVideogames.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))
   videogameName.length ?
   res.status(200).send(videogameName):
   res.status(404).send('game not found');
   } else {
   allVideogames = allVideogames.slice(0,15);
    res.status(200).send(allVideogames);
   };

});






module.exports = router;
