// Generated by CoffeeScript 1.10.0
(function() {
  var app, bodyParser, express, fs, http, io, passport, path, port, routes, server, socketio, sync;

  port = Number(process.env.PORT || 8000);

  express = require("express");

  app = express();

  routes = require("./server/routes");

  http = require("http");

  path = require("path");

  socketio = require("socket.io");

  fs = require("fs");

  passport = require("passport");

  bodyParser = require("body-parser");

  sync = require("async");

  app.use(express["static"](__dirname + "/app"));

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  server = app.listen(port, function() {
    return console.log("Listening on port %d", server.address().port);
  });

  app.get("/rest/codeList", routes.codeList);


  /* 대원관리 */

  app.get("/rest/member", routes.memberList);

  app.post("/rest/member", routes.insertMember);

  app.put("/rest/member", routes.updateMember);

  app.get("/rest/member/:memberId", routes.member);


  /* 출석관리 */

  app.get("/rest/att/list/:page", routes.attList);

  app.post("/rest/att/:practiceDt/:practiceCd", routes.createPracticeInfo);

  app["delete"]("/rest/att/:practiceDt/:practiceCd", routes.removeAttInfo);

  app.get("/rest/att/:practiceDt/:practiceCd", routes.attInfoDetail);

  app.put("/rest/att/:practiceDt/:practiceCd/musicInfo", routes.saveMusicInfo);

  app.put("/rest/att/:practiceDt/:practiceCd/etcMsg", routes.saveEtcMsg);

  app.post("/rest/att/:practiceDt/:practiceCd/select", routes.select);

  app.post("/rest/att/:practiceDt/:practiceCd/deselect", routes.deselect);

  app.put("/rest/att/:practiceDt/:practiceCd/lockAtt", routes.lockAtt);

  app.put("/rest/att/:practiceDt/:practiceCd/unlockAtt", routes.unlockAtt);


  /* 출석순위 */

  app.get("/rest/rank", routes.rank);


  /* 회의록 */

  app.get("/rest/doc", routes.docList);

  app.get("/rest/doc/:docId", routes.modifyDoc);


  /* 웹소켓 */

  io = socketio.listen(server);

  io.on("connection", function(socket) {

    /* 연습정보 상세정보 입장 */
    socket.on("join", function(data) {
      socket.join(data);
      return socket.room = data;
    });

    /* 연습정보 목록 입장 */
    socket.on("hallJoin", function() {
      return socket.join("hall");
    });

    /* 연습곡 정보 갱신 */
    socket.on("refreshMusicInfo", function(data) {
      io.sockets["in"]("hall").emit("refreshPage", "연습곡 정보가 갱신되었습니다.");
      return io.sockets["in"](socket.room).emit("replaceMusicInfo", data);
    });

    /* 메모 갱신 */
    socket.on("refreshEtcMsg", function(data) {
      io.sockets["in"]("hall").emit("refreshPage", "메모가 갱신되었습니다.");
      return io.sockets["in"](socket.room).emit("replaceEtcMsg", data);
    });

    /* 마감 (목록과 상세 두군데로 보내야 함) */
    socket.on("closeAtt", function() {
      io.sockets["in"]("hall").emit("refreshPage", "연습정보가 마감되었습니다.");
      return io.sockets["in"](socket.room).emit("refreshPage", "연습정보가 마감되었습니다.");
    });

    /* 마감 해제 (목록과 상세 두군데로 보내야 함) */
    socket.on("uncloseAtt", function() {
      io.sockets["in"]("hall").emit("refreshPage", "연습정보가 마감 해제 되었습니다.");
      return io.sockets["in"](socket.room).emit("refreshPage", "연습정보가 마감 해제 되었습니다.");
    });
    socket.on("addAtt", function() {
      return io.sockets["in"]("hall").emit("refreshPage", "새로운 연습정보가 추가되었습니다.");
    });

    /* 연습정보 삭제 */
    socket.on("removeAtt", function() {
      io.sockets["in"]("hall").emit("refreshPage", "연습정보가 삭제되었습니다.");
      return io.sockets["in"](socket.room).emit("backToList", "연습정보가 삭제되었습니다.");
    });

    /* 출석 체크 */
    return socket.on("select", function(data) {
      console.log("select Client Send Data:", data);
      return io.sockets["in"](socket.room).emit("select", data);
    });
  });

}).call(this);

//# sourceMappingURL=web.js.map
