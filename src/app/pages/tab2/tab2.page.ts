import { Component } from '@angular/core';
import { MapService } from '@services/map.service';

import {
  Capacitor,
  Plugins,
  CameraResultType,
  CameraPhoto,
  CameraSource,
  FilesystemDirectory
} from '@capacitor/core';
import { Post } from '@interfaces/index';
const { Camera, Storage, Filesystem } = Plugins;

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

  async takePicture() {
    const originalPhoto = await Camera.getPhoto({
      quality: 30,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      correctOrientation: true,
      source: CameraSource.Camera
    });

    const photoInTempStorage = await Filesystem.readFile({
      path: originalPhoto.path
    });

    const date = new Date();
    const time = date.getTime();
    const fileName = time + '.jpeg';

    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: fileName,
      directory: FilesystemDirectory.Data
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName
    });

    const photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);

    this.post.images.push(photoPath);
  }

  sharePost(): void {
    const cords = this.mapService.getCoords();
    this.post.coords = cords;
    this.mapService.postList.push(this.post);
    Storage.set({
      key: 'posts',
      value: JSON.stringify(this.mapService.postList)
    }).then(() => {
      this.mapService.createMarker(this.post);
      this.post = {
        title: '',
        images: [],
        coords: { lat: 0, lng: 0 }
      };
    });
  }
}
