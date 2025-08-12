const Blog = require("./blog");
const User = require("./user");
const Readinglist = require("./readinglist")
const Session = require("./session")

//Blog.sync();
//User.sync();

User.hasMany(Blog)
Blog.belongsTo(User)
//Blog.sync({ alter: true })
//User.sync({alter:true})
User.belongsToMany(Blog,{through:Readinglist,as:'readings'})
Blog.belongsToMany(User,{through:Readinglist})

module.exports = {
  Blog,User,Readinglist,Session 
};
