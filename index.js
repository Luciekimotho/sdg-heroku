let express = require("express");
let mongoose = require('mongoose');
let cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware');
const dotenv = require('dotenv');
dotenv.config();
const path = require("path");

const PORT = process.env.PORT || 8080;
let app = express();



const CLIENT_BUILD_PATH = path.join(__dirname, "client/build");
const apiRoutes = require('./app/routes/file.routes.js');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(cors());

// res.sendFile(path.join(__dirname, '../server','build','index.html'));
// app.use(express.static("public"));

mongoose.Promise = global.Promise;
// mongoose options
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0
};
// mongodb environment variables
const {
  MONGO_HOSTNAME,
  MONGO_DB,
  MONGO_PORT
} = process.env;

const dbConnectionURL = {
  'LOCALURL': `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`
};

//mongoose.connect(dbConnectionURL.LOCALURL, options);
mongoose.connect( 'mongodb://heroku_p1d2r44m:2hre81jm5rg9oc0gejfbmfm5pg@ds149998.mlab.com:49998/heroku_p1d2r44m', options);
let db = mongoose.connection;

if(!db){
    console.log("Connection error");
}else{
    console.log("Connection successful")
}

// Static files
app.use(express.static(CLIENT_BUILD_PATH));
app.use('/api', apiRoutes);

app.get('/api/files', function(req, res){
   res.sendStatus(200);
});

app.get('/api/user/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(CLIENT_BUILD_PATH , "index.html"));
  })

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
   });