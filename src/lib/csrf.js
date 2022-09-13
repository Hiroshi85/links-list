const {v4: uuid} = require('uuid');

const generateCsrf = (req, res, next) => {
    if(req.session.csrf === undefined){
        req.session.csrf = uuid();
    } 
    next();
}

const validateCsrf = (req, res, next) => {
        if((!req.body.csrf_token || req.body.csrf_token !== req.session.csrf)){
            return res.status(422).send('CSRF Token missing or expired');
        }else{
            next();
        }
    }
    
    
    


module.exports = {generateCsrf, validateCsrf};