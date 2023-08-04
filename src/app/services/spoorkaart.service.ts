import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { LatLngTuple } from "leaflet";
import { Config } from "../config";
import { SpoorKaartResponse } from "../model/reponse-types";

export type SpoorKaart =  Array<{key: string, coordinates: LatLngTuple[]}>;
@Injectable({
  providedIn: 'root'
})
export class SpoorkaartService {

  constructor(private httpClient: HttpClient, private config: Config) {
  }

  public getSpoorkaart(): Observable<SpoorKaart> {
    const response$ = this.httpClient.get('https://gateway.apiportal.ns.nl/spoorkaart-api/api/v1/spoorkaart',
      { headers: this.config.headers }) as Observable<SpoorKaartResponse>;

    return response$.pipe(map(response => response.payload.features.map(feature => {
        return {
            key: feature.properties.from + ' - ' + feature.properties.to,
            coordinates: feature.geometry.coordinates.map(([x, y]: LatLngTuple) => ([y, x] as LatLngTuple))
        }
    })));
  }
}
