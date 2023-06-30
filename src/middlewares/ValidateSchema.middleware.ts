import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";

export function validateSchema(schema: Joi.Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        const errorMessage = error.details.map((detail) => detail.message);
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ error: errorMessage });
      }
      next();
    };
  }