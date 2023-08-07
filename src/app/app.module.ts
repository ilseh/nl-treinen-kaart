import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NetherlandsMapComponent } from "./netherlands-map/netherlands-map.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { StartComponent } from "./start/start.component";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, NetherlandsMapComponent, StartComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
