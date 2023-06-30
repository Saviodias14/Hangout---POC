import { LocationId } from "@/controllers/places.controllers"
import { connection } from "@/database/database"
import { Place } from "@/protocols/place.protocols"


export async function getPlaces() {
    const result = await connection.query<(Omit<Place, "location">)>(`
    SELECT place.id, place.name, place.capacity, place.expedient, location.cep, location.number
    FROM place
    JOIN location ON place."locationId" = location.id
    GROUP BY place.id, place.name, place.capacity, place.expedient, location.cep, location.number;
    `)
    return result.rows
}

export async function postLocation(cep: number, number: number) {
    type Id = {
        id: number
    }
    const result = await connection.query<Id>(`
    INSERT INTO location (cep, number) VALUES ($1, $2)
    RETURNING location.id
    `, [cep, number])
    return result.rows[0].id
}

export async function postPlaces(name: string, capacity: number, expedient: string, locationId: number) {
    await connection.query(`
    INSERT INTO place (name, capacity, expedient, "locationId") 
    VALUES ($1, $2, $3, $4)`, [name, capacity, expedient, locationId])
}

export async function updatePlace(body: (Omit<Place, "location">), id: number) {
    
    const locationId = await connection.query<LocationId>(`
    UPDATE place
    SET name = $1, capacity = $2, expedient = $3
    WHERE id =$4 
    RETURNING place."locationId"`, [body.name, body.capacity, body.expedient, id])
    return locationId.rows[0]
}

export async function updateLocation(body: (Omit<Place, "location">), locationId: number) {
    await connection.query(`
    UPDATE location
    SET cep = $1, number = $2
    WHERE id =$3`, [body.cep, body.number, locationId])
}

export async function deletePlace(id:number){

    const locationId = await connection.query<LocationId>(`DELETE FROM place WHERE id = $1 RETURNING place."locationId"`, [id])
    return locationId.rows[0]
}

export async function deleteLocation(locationId:number){

    await connection.query(`DELETE FROM location WHERE id = $1`, [locationId])
}