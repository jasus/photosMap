import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

import { Plugins, GeolocationPosition } from '@capacitor/core';

const { Geolocation, Storage } = Plugins;

import * as mapboxgl from 'mapbox-gl';

import { Post, Coords } from '@interfaces/index';

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

  public postList: Post[] = [];

  constructor() {
    this.mapbox.accessToken = environment.mapBoxToken;

    this.getCurrentPosition();
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
      this.resize();

      this.getPostsFromStorage();
    });

    this.watchPosition();
  }

  createMarker(post: Post): void {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundSize = 'cover';
    el.style.backgroundImage = `url(${post.images[0]})`;
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.borderRadius = '4px';

    new mapboxgl.Marker(el)
      .setLngLat([post.coords.lng, post.coords.lat])
      .addTo(this.map);
  }

  getCoords(): Coords {
    const { lng, lat } = this.map.getCenter();
    return {
      lat,
      lng
    };
  }

  resize(): void {
    if (this.map !== undefined) {
      this.map.resize();
    }
  }

  private getPostsFromStorage(): void {
    Storage.get({ key: 'posts' }).then(objectStorage => {
      this.postList = JSON.parse(objectStorage.value);

      if (this.postList !== null && this.postList.length > 0) {
        this.postList.forEach(post => {
          this.createMarker(post);
        });
      } else {
        this.postList = [];
      }
    });
  }

  private getCurrentPosition(): void {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(
      (position: GeolocationPosition) => {
        this.setCenter(position);
      }
    );
  }

  private watchPosition(): void {
    Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position: GeolocationPosition) => {
        // this.setCenter(position);
      }
    );
  }

  private setCenter(position: GeolocationPosition): void {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.map.setCenter([this.lng, this.lat]);
  }
}
