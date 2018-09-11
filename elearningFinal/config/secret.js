/*
File to hold the important data like API keys, data base connections,
facebook authentication fields, port number

"exports" make this file exportable so that the fields in thus file 
can be used in other files

secret and facebook attributes to store the authentication details of facebook
*/


module.exports=
{
  database:'mongodb://root:abc123@ds139929.mlab.com:39929/elearning',
  port:8080,
  secretKey: 'abc123',
  facebook: 
  {
    clientID: '2264574397106502',
    clientSecret: 'd0cc8d3a5fdbed485ab8d04460e785c5',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'https://localhost:8082/auth/facebook/callback',
    passReqToCallback: true,  //sending request to call back
  }
}