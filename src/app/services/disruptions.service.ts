import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { LatLngTuple } from "leaflet";
import { Config } from "../config";
import { Injectable } from "@angular/core";
import { Disruptions, DisruptionsResponse } from "../model/disruption-types";

@Injectable({
  providedIn: 'root'
})
export class DisruptionsService {

  constructor(private httpClient: HttpClient, private config: Config) {
  }

  public getDisruptions(): Observable<Disruptions> {
    const endpoint = 'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen.json?actual=true';

    const response$ = this.httpClient.get(endpoint,
      { headers: this.config.headers }) as Observable<DisruptionsResponse>;

    return response$.pipe(map(response => response.payload.features.map(feature => {
        const coordinates = feature.geometry.coordinates;
        const flattenedCoordinates = coordinates.flatMap((coordinate: LatLngTuple[]) => {
          return coordinate.map(([x, y]: LatLngTuple) => ([y, x] as LatLngTuple));
        });
        return {
            type: feature.properties.disruptionType,
            niveau: feature.properties.niveau,
            coordinates: flattenedCoordinates
        };
    })));
  }
}
