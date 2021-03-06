import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MapService } from '@services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  constructor(private readonly mapService: MapService) {}

  ngOnInit(): void {
    this.mapService.buildMap();
  }

  ngAfterViewInit(): void {}
}
