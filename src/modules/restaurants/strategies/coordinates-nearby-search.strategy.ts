import axios from 'axios';
import { NearbySearchParams } from '../interfaces/nearby-search-params.interface';
import { Restaurant } from '../interfaces/restaurant.interface';
import { NearbySearchStrategy } from './nearby-search.strategy';
import { envs } from 'src/config/envs';
import { BadRequestException } from '@nestjs/common';

export class CoordinatesNearbySearchStrategy implements NearbySearchStrategy {
  async search(params: NearbySearchParams): Promise<Restaurant[]> {
    if (!params.lat || !params.lng) {
      throw new BadRequestException(
        'Los parámetros latitud y longitud son requeridos para la busqueda de restaurantes por coordenada.',
      );
    }
    const { lat, lng } = params;
    const placesRes = await axios.get(envs.googlePlacesUrl, {
      params: {
        location: `${lat},${lng}`,
        radius: 1500,
        type: 'restaurant',
        key: envs.googleApiKey,
      },
    });

    return placesRes.data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      place_id: place.place_id,
    }));
  }
}
