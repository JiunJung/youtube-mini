import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"
import {localsMiddleware} from "./middlewares";
import MongoStore from "connect-mongo";

const app = express(); 
const logger = morgan("dev");


app.set("views",process.cwd() + '/src/views');
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret : process.env.COOKIE_SECRET,
  resave:false,
  saveUninitialized : false,
  store:MongoStore.create({mongoUrl:process.env.DB_URL}),
}));

app.use(localsMiddleware);

app.use("/",rootRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);

export default app; //server.js는 app을 configure해서 export하는 파일

 


