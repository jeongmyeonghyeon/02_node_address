var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1. body-parser module 을 bodyParser 변수에 담음.
var app = express();

// DB setting ...
mongoose.set('useNewUrlParser', true);      
mongoose.set('useFindAndModify', false);    
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_DB);     

var db = mongoose.connection;               

db.once("open", function () {
    console.log("DB connected");
});

db.on("error", function (err) {
    console.log("DB ERROR: ", err)
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true})) // 3
// 2&3
// : bodyParser로 stream의 form data를 req.body에 옮겨 담음.
// 2번은 json data 를.
// 3번은 urlencoded data 를 분석해서 req.body 를 생성.
// ※ 쉽게 얘기해 이 모듈로 이렇게 처리를 해줘야 form 에 입력한 data 가 req.body 에 object로 생성됨.

// DB schema // 4
// mongoose.Schema 함수를 사용해서 DB에서 사용할 schema object를 생성.
// 이 형태대로 DB에 data가 저장됨.
var contactSchema = mongoose.Schema({
    name: {type:String, required: true, unique: true},  // 반드시 입력되어야 하며 (required), 중복되면 안됨 (unique), type 은 String.
    email: {type:String},
    phone: {type:String}
});
// 나머지 사용가능한 schema type 들: https://mongoosejs.com/docs/schematypes.html
var Contact = mongoose.model("contact", contactSchema); // 5

// Routes
// Home // 6
app.get("/", function (req, res) {
    res.redirect("/contacts");
});
// Contacts - Index // 7
app.get("/contacts", function (req, res) {
    Contact.find({}, function (err, contacts) {
        if (err) return res.json(err);
        res.render("contacts/index", {contacts:contacts});
    });
});
// Contacts - New // 8
app.get("/contacts/new", function(req, res) {
    res.render("contacts/new");
});
// Contacts - create // 9
app.post("/contacts", function (req, res) {
    Contact.create(req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts");
    });
});

// Port setting ...
var port = 3000;
app.listen(3000, function () {
    console.log("server on ! http://localhost:"+port);
});


























