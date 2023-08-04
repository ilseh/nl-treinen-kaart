import { LatLngTuple } from "leaflet";

export interface GeometricResponse<T, G> {
  payload: {
    features: Array<{
      properties: T
      geometry: G
    }>
  }
};

export type SpoorKaartResponse = GeometricResponse<{ from: string, to: string }, { coordinates: LatLngTuple[] }>;
export type DisruptionsResponse = GeometricResponse<{ disruptionType: string, stations: string[], niveau: string }, {
  coordinates: Array<LatLngTuple[]>
}>;

