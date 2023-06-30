
export type Place = {
    id: number,
    name: string,
    capacity: number,
    expedient: string,
    cep: number,
    number: number,
    location: location
}

export type location = {
    cep: string|number,
    logradouro: string | void,
    complemento?: string | void,
    bairro: string | void,
    localidade: string | void,
    uf: string | void,
    ibge?: string | void | number,
    gia?: string | void,
    ddd?: string | void | number,
    siafi?: string | void | number,
    number?: number
}

export type Errors = {
    type: string,
    message: string
}

