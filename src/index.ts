import express, {Request, Response, json} from "express";
import "express-async-errors"
import httpStatus from "http-status";
import placesRouter from "@/routers/places.routers";
import { middlewareErrors } from "./middlewares/error.middleware";

const app = express()
app.use(json())
app.use(placesRouter)

app.get("/health", (req:Request, res: Response)=>{
    return res.sendStatus(httpStatus.OK)
})
app.use(middlewareErrors)

const port:number = parseInt(process.env.PORT) || 5000

app.listen(port, ()=>{
    console.log(`Service running on port ${port}`)
})