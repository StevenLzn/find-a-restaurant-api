import { NearbySearchParams } from '../interfaces/nearby-search-params.interface';
import { Restaurant } from '../interfaces/restaurant.interface';

// Interfaz que deben implementar las estrategias de búsqueda de restaurantes cercanos.
export interface NearbySearchStrategy {
  search(params: NearbySearchParams): Promise<Restaurant[]>;
}
