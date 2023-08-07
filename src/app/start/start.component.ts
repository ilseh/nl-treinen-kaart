import { Component } from '@angular/core';
import { Form, FormBuilder } from "@angular/forms";

@Component({
  selector: 'nl-treinen-kaart-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  public form = this.formBuilder.group({
    werkzaamheden: true,
    storingen: true,
  });

    constructor(private formBuilder: FormBuilder) {
    }
}
