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
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({
    extended: true
})) // 3
// 2&3
// : bodyParser로 stream의 form data를 req.body에 옮겨 담음.
// 2번은 json data 를.
// 3번은 urlencoded data 를 분석해서 req.body 를 생성.
// ※ 쉽게 얘기해 이 모듈로 이렇게 처리를 해줘야 form 에 입력한 data 가 req.body 에 object로 생성됨.

// DB schema // 4
// mongoose.Schema 함수를 사용해서 DB에서 사용할 schema object를 생성.
// 이 형태대로 DB에 data가 저장됨.
var contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, // 반드시 입력되어야 하며 (required), 중복되면 안됨 (unique), type 은 String.
    email: {
        type: String
    },
    phone: {
        type: String
    }
});
// 나머지 사용가능한 schema type 들: https://mongoosejs.com/docs/schematypes.html
var Contact = mongoose.model("contact", contactSchema); // 5
// mongoose.model 함수를 사용하여 contact schema의 model 을 생성.
// mongoose.model 함수의 첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름.
// 두번째는 mongoose.Schema 로 생성된 오브젝트.
// DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact라는 변수에 연결해주는 역할.

// Routes
// Home // 6 이건 뭐... 설명 패스. res 인자의 redirect 를 통해서 redirect 한다는 것만 유의.
app.get("/", function (req, res) {
    res.redirect("/contacts");
});

// Contacts - Index // 7
// Contact.find({}, function (err, contacts) {...} 의 정체...)
// 모델.find(검색조건, 콜백_함수)
// 1. 모델.find
// : 이 함수는 DB에서 검색조건에 맞는 모델(여기서는 Contact) data를 찾고 콜백_함수를 호출하는 함수
// 2. 모델.find 의 검색조건 ({})
// : Object 형태로 전달. 빈 Object({})를 전달하는 경우(=검색조건 없음) DB 에서 해당 모델의 모든 data를 return. (select * from TB_NAME 같은건가?)
// 3. 모델.find 의 콜백_함수는 function(에러, 검색결과)의 형태.
// : 첫 번째 인자인 err 는 error 가 있는 경우에만 내용이 전달됨. 즉 if (err) 로 판별가능.
// 두 번째 parameter인 검색결과(여기서는 contacts)는 한개 이상일 수 있기 때문에 검색결과는 항상 array. 검색결과가 없는 경우에는 빈 array([]) → 이를 표현하기 위해 복수형인 contacts 사용.
app.get("/contacts", function (req, res) {
    Contact.find({}, function (err, contacts) {
        if (err) return res.json(err); // 에러가 있다면 error 를 json 형태로 출력
        res.render("contacts/index", { // 없다면, views/contacts/index.ejs render
            contacts: contacts
        });
    });
});
// Contacts - New // 8 이것도 뭐 패스... views/contacts/new.ejs 에는 form 이 있다.
app.get("/contacts/new", function (req, res) {
    res.render("contacts/new");
});
// Contacts - create // 9 "/contacts/new" 에서 폼을 전달받은 경우.
// 모델.create 는 DB에 data를 생성하는 함수.
// 첫번째 param: 생성할 data의 object(req.body)
// 두번째 param: 콜백_함수
// .create 의 콜백_함수 역시 첫 번째 인자는 err. 두번째인자는 parameter로 생성된 data를 받음.
// 생성된 data는 항상 하나이므로, 단순형인 contact 사용.
app.post("/contacts", function (req, res) {
    Contact.create(req.body, function (err, contact) {
        if (err) return res.json(err);
        res.redirect("/contacts"); // 에러없이 data가 생성되면 /contacts로 redirect.
    });
});

// Port setting ...
var port = 3000;
app.listen(3000, function () {
    console.log("server on ! http://localhost:" + port);
});