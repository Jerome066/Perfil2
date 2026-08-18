import { Component, inject, signal } from '@angular/core';
import { JsonTreeComponent } from "../json-tree/json-tree.component";
import { JsonServiceService } from '../../services/json-service.service';

import { MatTabsModule } from '@angular/material/tabs';


import { JsonTabs } from '../../models/json-tabs';
import { JsonNode } from '../../models/json-node';
import { JsonTabsComponent } from "../json-tabs/json-tabs.component";
import { JsonMenu } from '../../models/json-menu';

@Component({
  selector: 'app-json-perfil-main',
  imports: [JsonTreeComponent, MatTabsModule, JsonTabsComponent],
  templateUrl: './json-perfil-main.component.html',
  styleUrl: './json-perfil-main.component.css'
})
export class JsonPerfilMainComponent {
  private datosArbol = inject(JsonServiceService);
  private arbol = signal<JsonNode[]>([]);
  tieneArchivo = signal<boolean>(false);
  tabs = signal<JsonTabs[]>([]);
  tabActual = signal(0);

  obtenerArbol(a: JsonNode[]): void {
    this.arbol.set(a);
    this.cargarTabs();
    this.estadoArbol();
  }

  estadoArbol(): void{
    if(this.datosArbol){
      this.tieneArchivo.set(true);
    }
  }

  cargarTabs(): void {
    const resultado = this.datosArbol.obtenerTabs(this.arbol());
    this.tabs.set(resultado);
  }

  ActualizarTab(num: number): void{
    this.datosArbol.ActualizarMenu(num);
  }

  cargarMenu(): JsonMenu[]{
    return this.datosArbol.obtenerMenu();
  }

}
