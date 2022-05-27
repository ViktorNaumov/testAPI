const jwt = require("jsonwebtoken");
const Data = require("./getData");
const keys = require("./key");
const fileMiddleware = require("./middleware/upload");

module.exports.login = async function (req, res) {
  Data.findLoginUser(req.body, (result) => {
    if (result[0]) {
      Data.userLogin(req.body.pass, result[0].id, (id, a) => {
        if (a) {
          const token = jwt.sign(
            {
              email: req.body.login,
              user_id: id,
            },
            keys.jwt,
            { expiresIn: 60 * 60 * 3 }
          );

          console.log("Пароль подошёл");
          res.status(200).json({
            message: "Вы авторизованы",
            token: `Bearer ${token}`,
            resultCode: 0,
            email: req.body.login,
          });
        } else {
          res.status(401).json({
            message: "Неверный пароль. Вы не авторизованы",
            resultCode: 1,
          });
        }
      });
    } else {
      return res
        .status(401)
        .json({ message: "Данный email в системене не зарегистрирован" });
    }
  });
};

module.exports.register = async function (req, res) {
  Data.findLoginUser(req.body, (id) => {
    if (id[0] !== undefined)
      return res.status(409).json({
        resultCode: 1,
        message: "Такой email уже занят. Попробуйте другой",
      });
    else {
      try {
        Data.userRegister(req.body, () => {
          return res
            .status(201)
            .json({ resultCode: 0, message: "Пользователь создан" });
        });
      } catch (e) {}
    }
  });
};

module.exports.sendMessage = async function (req, res) {
  try {
    console.log(req.body);
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, keys.jwt);
      if (decoded) {
        fileMiddleware.any()(req, res, () => {
          path = req.files[0].path.split("uploads")[1].split("\\")[1];
          Data.sendMessage(decoded.user_id, req.body, path, () => {});

          res.json({
            name: "message created",
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.me = async function (req, res) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, keys.jwt);
      if (decoded) {
        Data.getArray(decoded.user_id, (result) => {
          res.json(result);
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ mess: " please login" });
  }
};

module.exports.correct = async function (req, res) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, keys.jwt);
      if (decoded) {
        fileMiddleware.any()(req, res, () => {
          path = req.files[0]
            ? req.files[0].path.split("uploads")[1].split("\\")[1]
            : "";
          Data.setCorrect(req.body.message_id, req.body.message, path, () => {
            res.json({
              mess: "message corrected",
            });
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      mess: "message not corrected, try later",
    });
  }
};

module.exports.delete = async function (req, res) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, keys.jwt);
      if (decoded) {
        Data.deleteMessage(req.body.message_id, () => {
          res.json({
            mess: "message deleted",
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      mess: "message not deleted, try later",
    });
  }
};
