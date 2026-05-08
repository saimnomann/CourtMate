const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res, next) => {
  try {
    
    let token = req.cookies?.token;


    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);



    req.user = decoded;
    next();
  } catch (error) {


    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      path: "/"
    });

    return res.redirect("/login");
  }
};