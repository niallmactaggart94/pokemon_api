export interface PokeList {
  name: string;
  url: string;
}

export interface PokeApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeList[];
}

interface PokeSprites {
  back_default: string | null;
  back_shiny: string | null;
  front_default: string | null;
  front_shiny: string | null;
}

export interface PokeDetails {
  name: string;
  id: number;
  sprites: PokeSprites;
}

export interface Pokemon {
  name: string;
  id: number;
  imageUrl: string;
}
