import { Component, input } from '@angular/core';
import { JsonInfo } from '../../models/json-info';
import { TableComponent } from '../table/table.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-json-information',
  imports: [TableComponent, CardComponent],
  templateUrl: './json-information.component.html',
  styleUrl: './json-information.component.css'
})
export class JsonInformationComponent {
  registros = input<JsonInfo[]>([]);
  vista = input<'tabla' | 'tarjeta'>('tabla');
}
