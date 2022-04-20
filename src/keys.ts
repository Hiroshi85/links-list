interface Database{
    host?: string,
    user?: string,
    password?: string,
    database?: string
}

export const database: Database = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
};
