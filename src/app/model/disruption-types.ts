import { LatLngTuple } from "leaflet";

export type DisruptionType = 'WERKZAAMHEID' | 'STORING';
export type Disruptions = Array<{ type: DisruptionType, niveau: string, coordinates: LatLngTuple[] }>;


export interface GeometricResponse<T, G> {
  payload: {
    features: Array<{
      properties: T
      geometry: G
    }>
  }
};

export type SpoorKaartResponse = GeometricResponse<{ from: string, to: string }, { coordinates: LatLngTuple[] }>;
export type DisruptionsResponse = GeometricResponse<{
  disruptionType: DisruptionType,
  stations: string[],
  niveau: string
}, {
  coordinates: Array<LatLngTuple[]>
}>;
