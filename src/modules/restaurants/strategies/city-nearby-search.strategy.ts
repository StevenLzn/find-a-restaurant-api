import axios from 'axios';
import { NearbySearchParams } from '../interfaces/nearby-search-params.interface';
import { Restaurant } from '../interfaces/restaurant.interface';
import { NearbySearchStrategy } from './nearby-search.strategy';
import { envs } from 'src/config/envs';
import { BadRequestException } from '@nestjs/common';

export class CityNearbySearchStrategy implements NearbySearchStrategy {
  async search(params: NearbySearchParams): Promise<Restaurant[]> {
    if (!params.city) {
      throw new BadRequestException('El parámetro "city" es requerido para la busqueda de restaurantes cercanos por ciudad.');
    }
    const geoResponse = await axios.get(envs.googleGeocodingUrl, {
      params: { address: params.city, key: envs.googleApiKey },
    });

    const location = geoResponse.data.results[0]?.geometry.location;
    if (!location) return [];

    const placesResponse = await axios.get(envs.googlePlacesUrl, {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 1500,
        type: 'restaurant',
        key: envs.googleApiKey,
      },
    });

    return placesResponse.data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      place_id: place.place_id,
    }));
  }
}
