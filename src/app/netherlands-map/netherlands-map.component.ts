import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { SpoorkaartService } from "../services/spoorkaart.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Disruptions, DisruptionsService } from "../services/disruptions.service";
import { BehaviorSubject, combineLatest, filter, Observable, of, tap } from "rxjs";

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
  private disruptions$: Observable<Disruptions> = of([]);

  private showWerkzaaheden$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private showStoringen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private spoorkaartService: SpoorkaartService, private disruptionService: DisruptionsService) {
  }

  ngOnInit() {
    this.initMap();
    this.getSpoorkaart();
    // this.getDisruptions();
    this.disruptions$ = this.disruptionService.getDisruptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showStoringen'] && this.showStoringen != null) {
      this.showStoringen$.next(this.showStoringen);
    }
    if (changes['showWerkzaamheden'] && this.showWerkzaamheden != null) {
      this.showWerkzaaheden$.next(this.showWerkzaamheden);
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
    combineLatest([this.disruptions$, this.showStoringen$, this.showWerkzaaheden$])
      .pipe(tap(test => console.log('tst', test)), untilDestroyed(this), filter(([disruptions,]) => disruptions.length > 0))
      .subscribe(([disruptions, showStoringen, showWerkzaamheden]) => {
        disruptions.forEach(disruption => {
          if (disruption.type === 'WERKZAAMHEID' && !showWerkzaamheden || disruption.type === 'STORING' && !showStoringen) {
            return;
          }
          const color = disruption.niveau === 'MINDER_TREINEN' ? 'orange' : 'red';
          this.drawLines(disruption.coordinates, color);
        })
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

  private drawLines(coordinates: LatLngTuple[], color: string): void {
    if (this.map && coordinates.length > 0) {
      const line = L.polyline(coordinates, { color }).addTo(this.map);

      // Optioneel: centreer de kaart op de lijn
      // this.map.fitBounds(line.getBounds());
    }
  }
}
