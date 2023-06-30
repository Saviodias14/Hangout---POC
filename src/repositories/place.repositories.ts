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
    let counter:number = 1
    const array: (string|number)[] = []
    let query:string = "UPDATE place SET "
    if(body.name){
        query = query + `name = $${counter} `
        counter++
        array.push(body.name)
    }
    if(body.capacity){
        query = query + `capacity = $${counter} `
        counter++
        array.push(body.capacity)
    }
    if(body.expedient){
        query = query + `expedient = $${counter} `
        counter++
        array.push(body.expedient)
    }
    query = query + `WHERE id =$${counter} 
    RETURNING place."locationId"`
    if(counter===1){
        query = `SELECT place."locationId" FROM place WHERE id = $${counter}`
    }
    console.log(query)
    array.push(id)
    const locationId = await connection.query<LocationId>(query, array)
    return locationId.rows[0]
}

export async function updateLocation(body: (Omit<Place, "location">), locationId: number) {

    let counter:number = 1
    const array: (string|number)[] = []
    let query:string = "UPDATE location SET "
    if(body.cep){
        query = query + `cep = $${counter} `
        counter++
        array.push(body.cep)
    }
    if(body.number){
        query = query + `number = $${counter} `
        counter++
        array.push(body.number)
    }
    if(counter===1){
        return
    }
    query = query + `WHERE id =$${counter}`
    console.log(query)
    array.push(locationId)
    await connection.query(query, array)
}

export async function deletePlace(id:number){

    const locationId = await connection.query<LocationId>(`DELETE FROM place WHERE id = $1 RETURNING place."locationId"`, [id])
    return locationId.rows[0]
}

export async function deleteLocation(locationId:number){

    await connection.query(`DELETE FROM location WHERE id = $1`, [locationId])
}