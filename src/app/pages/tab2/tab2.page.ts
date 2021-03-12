import { Component } from '@angular/core';

import {
  Plugins,
  CameraResultType,
  CameraPhoto,
  CameraSource
} from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  post = {
    title: '',
    images: []
  };

  constructor() {}

  takePicture() {
    Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      correctOrientation: true,
      source: CameraSource.Camera
    }).then((image: CameraPhoto) => {
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      const imageUrl = image.webPath;
      // Can be set to the src of an image now
      this.post.images.push(imageUrl);
    });
  }
}
