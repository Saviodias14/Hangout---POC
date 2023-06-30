import { Errors } from "@/protocols/place.protocols";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export function middlewareErrors(error:Errors, req:Request, res: Response, next: NextFunction){
    if(error.type==='NotFound'){
        return res.status(httpStatus.NOT_FOUND).send(error.message)
    }
    console.log(error)
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
}