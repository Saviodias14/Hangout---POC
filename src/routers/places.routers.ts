import { deletePlace, getPlaces, postPlaces, updatePlace } from "@/controllers/places.controllers";
import { validateSchema } from "@/middlewares/ValidateSchema.middleware";
import { placeSchema } from "@/schemas/place.schema";
import { Router } from "express";

const placesRouter = Router();

placesRouter.get("/places", getPlaces);
placesRouter.post("/places", validateSchema(placeSchema) ,postPlaces);
placesRouter.put("/places/:id", updatePlace);
placesRouter.delete("/places/:id", deletePlace);

export default placesRouter