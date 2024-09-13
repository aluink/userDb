import express from "express";
import serverless from "serverless-http";

import router from "./router.js";

const app = express();

app.use(express.json());

app.use('/', router);

export const handler = serverless(app); 
export default handler;
