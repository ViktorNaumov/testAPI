const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "21061983",
  database: "test",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return err;
  } else {
    console.log("База данных подключена");
  }
});

module.exports.findLoginUser = (data, callback) => {
  "Здесь делаем запрос в БД получаем id юзера соответствующего login";

  let query = "select id from user where login ='" + data.login + "';";

  connection.query(query, (err, result) => {
    if (err) console.log(err);
    else {
      callback(result);
    }
  });
};

module.exports.userLogin = (pass, id, callback) => {
  let query = "SELECT pass FROM user where id = '" + id + "';";

  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result[0]) {
        bcrypt.compare(toString(pass), result[0].pass).then((result) => {
          if (result) {
            callback(id, result);
          } else {
            callback(id, false);
          }
        });
      } else {
        return console.log("Произошла какая то непредвиденная хуйня");
      }
    }
  });
};

module.exports.userRegister = (data, callback) => {
  const salt = bcrypt.genSaltSync(10);

  bcrypt.hash(toString(data.pass), salt).then((hash) => {
    let query =
      "INSERT INTO user values(null,'" +
      data.name +
      "','" +
      data.login +
      "','" +
      hash +
      "',NOW());";

    connection.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        callback();
      }
    });
  });
};

module.exports.sendMessage = (id, data, path, callback) => {
  let query =
    "INSERT INTO message values(null,'" +
    data.message +
    "'," +
    id +
    ",'"+path+"',NOW()) ;";
  connection.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });

  callback();
};

module.exports.getArray=(id,callback)=>{
    let query = "Select * from message where user_id > 0;"
    connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          callback(result);
        }
      });

    
}

module.exports.setCorrect=(message_id,message,path,callback)=>{
    let query = "UPDATE message SET message='"+message+"',fileName= '"+path+"',date=NOW() where id="+message_id+";"
    connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          callback();
        }
      });
}