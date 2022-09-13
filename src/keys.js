database = {
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE
}
session_secret = process.env.SESSION_SECRET
module.exports = {database, session_secret}