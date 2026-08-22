const isStaff = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "security") {
    return res.status(403).json({ message: "Access denied. Staff only." });
  }
  next();
};

module.exports = isStaff;
