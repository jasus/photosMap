import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

import { Plugins, GeolocationPosition } from '@capacitor/core';

const { Geolocation } = Plugins;

import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapbox = mapboxgl;
  private map: mapboxgl.Map;
  private style = `mapbox://styles/mapbox/streets-v11`;

  private lat = 36.71296;
  private lng = -4.43026;
  private zoom = 15;

  constructor() {
    this.mapbox.accessToken = environment.mapBoxToken;
    this.getCurrentPosition();
  }

  getCurrentPosition(): void {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then((position: GeolocationPosition) => {
        this.setCenter(position);
      })
      .catch(error => {
        console.log(error);
      });
  }

  watchPosition(): void {
    Geolocation.watchPosition({ enableHighAccuracy: true }, position => {
      this.setCenter(position);
    });
  }

  setCenter(position: GeolocationPosition): void {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.map.setCenter({ lat: this.lat, lng: this.lng });
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      pitch: 35,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.map.on('load', () => {
      this.map.resize();
    });

    this.watchPosition();
  }
}
