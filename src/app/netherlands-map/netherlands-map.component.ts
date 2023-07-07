import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'nl-treinen-kaart-netherlands-map',
  templateUrl: './netherlands-map.component.html',
  styleUrls: ['./netherlands-map.component.scss'],
})
export class NetherlandsMapComponent implements OnInit {
  private map: L.Map| undefined;

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 52.1326, 5.2913 ], // Geografische coördinaten van Nederland
      zoom: 7
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }
}
