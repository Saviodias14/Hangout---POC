import { Request, Response } from "express";
import * as placeService from"@/services/place.services";
import httpStatus from "http-status";
import { Place } from "@/protocols/place.protocols";

export async function getPlaces(req: Request, res: Response){
    const result = await placeService.getPlaces()
    res.status(httpStatus.OK).send(result)
}

export async function postPlaces( req: Request, res: Response){
    const body:(Omit <Place, "location">) = req.body
    const result = await placeService.postPlaces(body)
    res.sendStatus(httpStatus.CREATED)
}

export async function updatePlace(req: Request, res: Response) {
    const id:number = parseInt(req.params.id)
    const body:(Omit <Place, "location">) = req.body
    const result = await placeService.updatePlace(body, id)
    res.sendStatus(httpStatus.ACCEPTED)
}

export async function deletePlace(req: Request, res: Response) {
    const id:number = parseInt(req.params.id)
    const result = await placeService.deletePlace(id)
    res.sendStatus(httpStatus.OK)
}

export type LocationId = {
    locationId:number
}

