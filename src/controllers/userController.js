import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => {
  res.render("join",{pageTitle:"Join!",});
};
export const postJoin = async(req,res) => {
  const {email,username,password,password2,name,location} = req.body;
  if(password!==password2){
    return res.status(400).render("join",{pageTitle:"Join!",error:"password confirmation does not match."}) 
  }
  const usernameExists = await User.exists({username});
  if(usernameExists){
    return res.status(400).render("join",{pageTitle:"Join!",error:"this username is already taken."})
  }
  const emailExists = await User.exists({email});
  if(emailExists){
    return res.status(400).render("join",{pageTitle:"Join!",error:"this email is already taken."})
  }
  try{
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  }catch(e){
    const error = e._message;
    return res.status(400).render("join",{pageTitle : "Join",error});
  }
};
export const getLogin = (req,res) => {
  return res.render("login",{pageTitle:"Login"});
}; 
export const postLogin = async (req,res) => {
  const {username,password} = req.body;
  const user = await User.findOne({username, socialOnly : false,});
  if(!user){
    return res.status(400).render("login",{pageTitle:"Login",error:"An account with this username does not exists."});
  }
  const ok = await bcrypt.compare(password,user.password);
  if(!ok){
    return res.status(400).render("login",{pageTitle:"Login",error:"Wrong password"});    
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const startGithubLogin = (req,res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id : process.env.GITHUB_CLIENT_ID,
    allow_signup : false,
    scope : "read:user user:email", 
  };
  const params  = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`; 
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req,res)=>{
  const {code} = req.query;
  const baseUrl = "https://github.com/login/oauth/access_token";
  const confirm = {
    client_id : process.env.GITHUB_CLIENT_ID,
    client_secret : process.env.GITHUB_CLIENT_SECRET,
    code,
  }
  const params = new URLSearchParams(confirm).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl,{
    method:"POST",
    headers : {
      Accept: "application/json",
    },   
  })
  ).json();
  if ("access_token" in tokenRequest){
    const {access_token} = tokenRequest;
    const apiUrl = "https://api.github.com"
    const userData = await (await fetch(`${apiUrl}/user`,{
      headers : {
        Authorization: `token ${access_token}`
      }
    })).json();
    const emailData = await (await fetch(`${apiUrl}/user/emails`,{
      headers : {
        Authorization: `token ${access_token}`,
      }
    })).json();
    const emailObj = emailData.find(email=>email.primary===true&&email.verified===true);
    if(!emailObj){
      return redirect("/login");
    }
    let user = await User.findOne({email:emailObj.email});
    if(!user){ //when user tries to login with github and there is same email in our userdatabase, then it means that he/she is out user so can be logged in.
        user = await User.create({
        email:emailObj.email,
        username:userData.login,
        socialOnly : true,
        avatarUrl : userData.avatar_url,
        password:"", //we don't need password beacause we are creating an account with github.
        name:userData.name,
        location:userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user; 
    return res.redirect("/");    
  }
  else{
    return res.redirect("/login");
  }
};
export const getEdit = (req,res) => {
  return res.render("edit-profile",{pageTitle:"Edit Profile"});
};
export const postEdit = async (req,res) => {
  const {
    session:{
      user:{_id},
    },
    body:{name,email,username,location},
  } = req;
  if(email!==req.session.user.email){
    const emailExists = await User.exists({email});
    if(emailExists){
      return res.render("edit-profile",{pageTitle:"Edit Profile",error:"that email already exists"});
    }
  }
  if(username!==req.session.user.username){
    const usernameExists = await User.exists({username});
    if(usernameExists){
      return res.render("edit-profile",{pageTitle:"Edit Profile",error:"that username already exists"});
    }
  }
  const user = await User.findByIdAndUpdate(_id,{
    name,
    email,
    username,
    location,
  },{new:true});
  req.session.user = user;
  return res.redirect("/users/edit");
};
export const logout = (req,res) => {
  req.session.destroy();
  return res.redirect("/")
};
export const see = (req,res) => res.send("see user");
