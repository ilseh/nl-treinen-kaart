import { Route } from '@angular/router';
import { NetherlandsMapComponent } from "./netherlands-map/netherlands-map.component";

export const appRoutes: Route[] = [
    {
        path: 'map',
        component: NetherlandsMapComponent,
    }
];
