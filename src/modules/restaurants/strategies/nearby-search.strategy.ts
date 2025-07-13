import { NearbySearchParams } from '../interfaces/nearby-search-params.interface';
import { Restaurant } from '../interfaces/restaurant.interface';

export interface NearbySearchStrategy {
  search(params: NearbySearchParams): Promise<Restaurant[]>;
}
