import { Place } from "@/protocols/place.protocols";
import Joi from "joi";

export const placeSchema = Joi.object<Omit<Omit<Place, "location">,"id">>({
    name: Joi.string().required(),
    capacity: Joi.number().integer().required(),
    expedient: Joi.string().required(),
    cep: Joi.number().integer().min(10000000).max(99999999).required().messages({
        'number.base': 'CEP deve ser um número',
        'number.integer': 'CEP deve ser um número inteiro',
        'number.min': 'CEP deve ter pelo menos 8 dígitos',
        'number.max': 'CEP deve ter no máximo 8 dígitos',
        'any.required': 'CEP é obrigatório',
      }),
    number: Joi.number().integer().required()
})