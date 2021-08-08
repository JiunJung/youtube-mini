import express from "express";
import {postLogin,getLogin, getJoin, postJoin} from "../controllers/userController";
import {home,searchVideo,} from "../controllers/videoController";
import {protectorMiddleware,publicOnlyMiddleware} from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/",home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search",searchVideo);

export default rootRouter;