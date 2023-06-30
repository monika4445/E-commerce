const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;

function admin_authenticate(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (token === null) {
      res.status(401).json({ message: "Not Allowed" });
    }
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Access is forbidden" });
      } else if (token && user.role === 1) {
        next();
      }
    });
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}

function user_authenticate(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (token === null) {
      res.status(401).json({ message: "Not Allowed!" });
    }
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Access is forbidden" });
      } else if (token && user.role === 0) {
        next();
      }
    });
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}



// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const {Cart} = require('../models');

// const SECRET = process.env.SECRET;

// function admin_authenticate(req, res, next) {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       res.status(401).json({ message: "Not Allowed" });
//       return;
//     }

//     jwt.verify(token, SECRET, (err, decoded) => {
//       if (err) {
//         res.status(403).json({ message: "Access is forbidden" });
//         return;
//       }

//       if (decoded.role !== 1) {
//         res.status(403).json({ message: "Access is forbidden" });
//         return;
//       }

//       // Check if the token belongs to the correct user (optional)
//       if (decoded.id !== req.params.userId) {
//         res.status(403).json({ message: "Access is forbidden!" });
//         return;
//       }

//       next();
//     });
//   } catch {
//     res.status(500).json({ message: "Server Problem" });
//   }
// }

//  function user_authenticate(req, res, next) {
//   try {
//     const token = req.headers.authorization;
//     const {id} = req.params;
//     console.log(id,'req')

//     if (!token) {
//       res.status(401).json({ message: "Not Allowed" });
//       return;
//     }

//     jwt.verify(token, SECRET, async(err, user) => {
//       if (err) {
//         res.status(403).json({ message: "Access is forbidden" });
//         return;
//       }

//       if (user.role !== 0) {
//         res.status(403).json({ message: "Access is forbidden" });
//         return;
//       }

//       // const getCart = await Cart.findOne({where:{userId:id}});
      
//       // if (!getCart || user.id !== getCart.userId) {
//       //   res.status(403).json({ message: "You don't have rights" });
//       //   return;
//       // }

//       next();
//     });
//   } catch {
//     res.status(500).json({ message: "Server Problem" });
//   }
// }

module.exports = { admin_authenticate, user_authenticate };
