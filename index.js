var express = require("express");
var mongoose = require("mongoose");
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);      // 1
mongoose.set('useFindAndModify', false);    // 1
mongoose.set('useCreateIndex', true);       // 1

mongoose.connect(process.env.MONGO_DB);     // 2

var db = mongoose.connection;               // 3
// 4
db.once("open", function () {
    console.log("DB connected");
});
// 5
db.on("error", function (err) {
    console.log("DB ERROR: ", err)
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

// Port setting
var port = 3000;
app.listen(3000, function () {
    console.log("server on ! http://localhost:"+port);
});

// [DB setting 관련 설명]

// 1. 
// mongoose에서 내는 몇가지 경고를 안나게 하는 코드. 없어도 실행에는 아무런 문제가 없음.
// 관련 내용 mongoose 문서: https://mongoosejs.com/docs/deprecations.html

// 2.
// 'process.env': node.js에서 기본으로 제공하는 Object. "환경변수"들을 가지고 있는 객체.
// ※ 환경변수 설정 (내 환경의 경우, MacOS/zsh) ※
// vi ~/.zshrc
// export MONGO_DB="mongodb+srv://user:<password>@cluster0-ysiqz.mongodb.net/test?retryWrites=true&w=majority"
// ※ 환경변수 확인 command → printenv 명령으로 확인 가능.

// 3.
// mongoose의 db object를 가져와 db변수에 넣는 과정.
// 이 db 변수에는 DB와 관련된 이벤트 리스너 함수들이 있음.

// 4.
// db가 성공적으로 연결된 경우 "DB connect" 출력.

// 5.
// db 연결중 에러가 있는 경우 "DB ERROR: " 와 에러 출력.

// + 추가설명 +
// DB연결은 앱이 실행되면 단 한번만 일어나는 이벤트. 그러므로, db_once("이벤트 이름", 콜백함수) 함수를 사용.
// error 는 DB접속시 뿐만 아니라, 다양한 경우에 발생할 수 있으며, DB 연결 후에는 DB 에러가 발생한 후에도 다른 DB 에러들이 또다시 발생할 수도 있기 때문에 db.on("이벤트_이름", 콜백함수) 함수를 사용합니다.