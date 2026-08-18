import { Component, inject, input, output } from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { JsonTabs } from '../../models/json-tabs';
import { JsonServiceService } from '../../services/json-service.service';


@Component({
  selector: 'app-json-tabs',
  imports: [MatTabsModule],
  templateUrl: './json-tabs.component.html',
  styleUrl: './json-tabs.component.css'
})
export class JsonTabsComponent {
  private datosArbol = inject(JsonServiceService);
  tabs = input.required<JsonTabs[]>();
  tabActual = output <number>();

  onTabChange(event: MatTabChangeEvent): void {
    this.tabActual.emit(event.index);
  }

  formatoString(cadena: string):string{
    return this.datosArbol.formarString(cadena);
  }
}
