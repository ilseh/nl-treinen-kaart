import { Route } from '@angular/router';
import { NetherlandsMapComponent } from "./netherlands-map/netherlands-map.component";
import { StartComponent } from "./start/start.component";

export const appRoutes: Route[] = [
    {
        path: '',
        component: StartComponent,
    }
];
