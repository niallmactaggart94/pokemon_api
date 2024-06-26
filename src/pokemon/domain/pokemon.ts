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

export interface PokeSprites {
  back_default: string | null;
  back_shiny: string | null;
  front_default: string | null;
  front_shiny: string | null;
  other: {
    home: {
      front_default: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface PokeDetails {
  name: string;
  id: number;
  sprites: PokeSprites;
}

export interface PokemonVerificationResponse {
  isCorrect: boolean;
  imageUrl: string;
  name: string;
}

export interface RandomPokemonReponse {
  choices: string[];
  correctId: number;
  correctImageUrl: string;
}
