import { Component, input } from '@angular/core';
import { JsonInfo } from '../../models/json-info';

@Component({
  selector: 'app-json-information',
  imports: [JsonInformationComponent],
  templateUrl: './json-information.component.html',
  styleUrl: './json-information.component.css'
})
export class JsonInformationComponent {
  registros = input.required<JsonInfo[]>();
}
