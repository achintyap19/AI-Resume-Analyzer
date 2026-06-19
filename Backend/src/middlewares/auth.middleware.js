const jwt = require('jsonwebtoken')
const blacklistTokenModel = require('../models/blacklist.model')

async  function authUser(req,res,next){

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: 'token not provided'
        })
    }

    const isTokenBlackListed = await blacklistTokenModel.findOne({
        token
    })

    if(isTokenBlackListed){
        return res.status(401).json({
            message: 'token is invalid'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    }catch(error){
        return res.status(401).json({
            message: 'invalid token'
        })
    }
    
}

module.exports = {authUser}