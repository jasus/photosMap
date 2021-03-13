import { Component } from '@angular/core';
import { MapService } from '@services/map.service';

import {
  Plugins,
  CameraResultType,
  CameraPhoto,
  CameraSource
} from '@capacitor/core';
import { Post } from '@interfaces/post';
const { Camera, Storage } = Plugins;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  post: Post = {
    title: '',
    images: [],
    coords: { lat: 0, lng: 0 }
  };

  constructor(private mapService: MapService) {}

  takePicture(): void {
    Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      correctOrientation: true,
      source: CameraSource.Camera
    }).then((image: CameraPhoto) => {
      const imageUrl = image.webPath;
      this.post.images.push(imageUrl);
    });
  }

  sharePost(): void {
    const cords = this.mapService.getCoords();
    this.post.coords = cords;
    Storage.set({
      key: '1',
      value: JSON.stringify(this.post)
    }).then(() => {
      this.mapService.setMarker(this.post);
      this.post = {
        title: '',
        images: [],
        coords: { lat: 0, lng: 0 }
      };
    });
  }
}
