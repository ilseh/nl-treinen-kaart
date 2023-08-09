import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { SpoorkaartService } from "../services/spoorkaart.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { DisruptionsService } from "../services/disruptions.service";
import { filter } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'nl-treinen-kaart-netherlands-map',
  templateUrl: './netherlands-map.component.html',
  styleUrls: ['./netherlands-map.component.scss'],
})
export class NetherlandsMapComponent implements OnInit, OnChanges {
  @Input()
  public showWerkzaamheden: boolean | null | undefined = true;
  @Input()
  public showStoringen: boolean | null | undefined = true;
  private map: L.Map | undefined;

  private werkzaamhedenLayers: L.Layer[] = [];
  private storingenLayers: L.Layer[] = [];

  constructor(private spoorkaartService: SpoorkaartService, private disruptionService: DisruptionsService) {
  }

  ngOnInit() {
    this.initMap();
    this.getSpoorkaart();
    this.getDisruptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showStoringen'] && this.showStoringen != null) {
      if (this.showStoringen) {
        this.storingenLayers.forEach(layer => this.map?.addLayer(layer));
      } else {
        this.storingenLayers.forEach(layer => this.map?.removeLayer(layer));
      }
    }
    if (changes['showWerkzaamheden'] && this.showWerkzaamheden != null) {
      if (this.showWerkzaamheden) {
        this.werkzaamhedenLayers.forEach(layer => this.map?.addLayer(layer));
      } else {
        this.werkzaamhedenLayers.forEach(layer => this.map?.removeLayer(layer));
      }
    }
  }

  private getSpoorkaart(): void {
    const spoorkaart$ = this.spoorkaartService.getSpoorkaart();
    spoorkaart$.pipe(untilDestroyed(this)).subscribe(spoorKaart => {
      spoorKaart.forEach(spoor => {
        this.drawLines(spoor.coordinates, 'black');
      })
    });
  }

  private getDisruptions(): void {
    this.disruptionService.getDisruptions().pipe(untilDestroyed(this), filter(disruptions => disruptions.length > 0))
      .subscribe(disruptions => {
        disruptions.forEach(disruption => {
          if (disruption.type === 'WERKZAAMHEID') {
            const layer = this.drawLines(disruption.coordinates, 'yellow');
            if (layer)
              this.werkzaamhedenLayers.push(layer);
          }
          if (disruption.type === 'STORING') {
            const layer = this.drawLines(disruption.coordinates, 'orange');
            if (layer)
              this.storingenLayers.push(layer);
          }

        });
      });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.1326, 5.2913], // Geografische coördinaten van Nederland
      zoom: 8
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.map.fitBounds([[50.5, 4.4], [53.5, 5.6]]);
  }

  private drawLines(coordinates: LatLngTuple[], color: string): L.Layer | undefined {
    if (this.map && coordinates.length > 0) {
      const line = L.polyline(coordinates, { color }).addTo(this.map);

      // Optioneel: centreer de kaart op de lijn
      // this.map.fitBounds(line.getBounds());

      return line;
    }
    return undefined;
  }
}
