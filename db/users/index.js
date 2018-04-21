module.exports = function(db){
    const userFunctions = {};

    userFunctions.createUser = (username,email,password,profile_pic_path) => {
        return new Promise(
            function(resolve,reject){
              db.none('INSERT INTO "users"'
                      +'(username,email,password,profile_pic_path) VALUES  ($1,$2,$3,$4)',
                        [username,email,password,profile_pic_path])
              .then( () => {resolve('Account successfully created');})
              .catch( error => {reject('Username or email already exists');});
            }
          )
    }

    return userFunctions;
}
