import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { SpoorkaartService } from "../services/spoorkaart.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { DisruptionsService } from "../services/disruptions.service";

@UntilDestroy()
@Component({
    selector: 'nl-treinen-kaart-netherlands-map',
    templateUrl: './netherlands-map.component.html',
    styleUrls: ['./netherlands-map.component.scss'],
})
export class NetherlandsMapComponent implements OnInit {
    private map: L.Map | undefined;

    constructor(private spoorkaartService: SpoorkaartService, private disruptionService: DisruptionsService) {}

    ngOnInit() {
        this.initMap();
        this.getSpoorkaart();
        this.getDisruptions();
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
        const disruptions$ = this.disruptionService.getDisruptions();
        disruptions$.pipe(untilDestroyed(this)).subscribe(disruptions => {
            disruptions.forEach(disruption => {
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
    }

    private drawLines(coordinates: LatLngTuple[], color: string): void {
        if (this.map && coordinates.length > 0) {
            const line = L.polyline(coordinates, { color }).addTo(this.map);

            // Optioneel: centreer de kaart op de lijn
            this.map.fitBounds(line.getBounds());
        }
    }
}
