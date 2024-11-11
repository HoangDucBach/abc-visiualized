export interface Parameters {
    maxIterations: number;
    foodSources: number;
}

export interface Bee {
    x: number;
    y: number;
    fitness: number;
    foodSource: number; 
    role: 'scout' | 'onlooker' | 'employed' ;
}

export interface FoodSource {
    x: number;
    y: number;
    quality: number;
}
