export type Pokemon = {
    name: string,
    url: string,
    detail: PokemonDetail
}

export type PokemonDetail = {
    //we focus only image and id
    sprites: {
        back_default: string
    }
    id: number
}
