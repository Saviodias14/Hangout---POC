import { Errors, Place, location } from "@/protocols/place.protocols"
import * as placeRepository from "@/repositories/place.repositories"
import axios from "axios"

export async function getPlaces() {
    const result = await placeRepository.getPlaces()
    if (!result) {
        throw notFound()
    }
    const updatedResult = await Promise.all(
        result.map(async (e) => {
            const cepData = await axios.get(`https://viacep.com.br/ws/${e.cep}/json/`);
            const location: location = cepData.data;
            const newElement: Place = {
                ...e,
                location: {
                    cep: location.cep,
                    logradouro: location.logradouro,
                    bairro: location.bairro,
                    localidade: location.localidade,
                    uf: location.uf,
                    number: e.number,
                },
            };
            delete newElement.cep
            delete newElement.number
            return newElement;
        })
    );
    return updatedResult
}

export async function postPlaces(body: (Omit<Place, "location">)) {
    const locationId = await placeRepository.postLocation(body.cep, body.number)
    await placeRepository.postPlaces(body.name, body.capacity, body.expedient, locationId)
}

export async function updatePlace(body: (Omit<Place, "location">), id: number) {
    const locationId = await placeRepository.updatePlace(body, id)
    if (!locationId) {
        throw notFound()
    }
    await placeRepository.updateLocation(body, locationId.locationId)
}

export async function deletePlace(id: number) {
    const locationId = await placeRepository.deletePlace(id)
    if (!locationId) {
        throw notFound()
    }
    await placeRepository.deleteLocation(locationId.locationId)
}

function notFound(): Errors {
    const error: Errors = {
        type: "NotFound",
        message: "Result not found"
    }
    return error
}