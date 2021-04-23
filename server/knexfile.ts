import path from 'path';

try{
    module.exports = {
        development: {
            client: 'sqlite',
            connection:{
                filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
            },
            migrations: {
                directory: path.resolve(__dirname, "src", "database", "migrations"),
            },
            useNullAsDefault: true,
        }
    };
}catch(err){
    console.log(err);
}