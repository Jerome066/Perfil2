import { Injectable } from '@angular/core';
import { JsonNode } from '../models/json-node';
import { JsonTabs } from '../models/json-tabs';
import { JsonMenu } from '../models/json-menu';

@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {
  arbol = <JsonNode[]>([]);
  tabs = <JsonTabs[]>([]);
  menus = <JsonMenu[]>([]);
  // datosPrimitivos: never[];

  constructor() {

  }

  nuevoArchivo() {
    if (this.tabs) {
      this.tabs = <JsonTabs[]>([]);
    }
    if (this.menus) {
      this.tabs = <JsonTabs[]>([]);
    }
  }

  obtenerTabs(nodos: JsonNode[]): JsonTabs[] {
    for (const tab of nodos) {
      this.tabs.push({
        tabName: tab.nombre,
        menuOpt: tab.hijos
      });
    }
    return this.tabs;
  }

  ActualizarMenu(num: number): JsonMenu[] {

    const tab = this.tabs[num];

    this.menus = [];
    // this.datosPrimitivos = [];

    for (const menu of tab.menuOpt) {

      const estructurados = menu.hijos.filter(hijo =>
        hijo.tipo === 'object' ||
        hijo.tipo === 'array'
      );

      const primitivos = menu.hijos.filter(hijo =>
        hijo.tipo !== 'object' &&
        hijo.tipo !== 'array'
      );

      if (estructurados.length > 0) {
        this.menus.push({
          option: menu.nombre,
          idReferencia: tab.tabName,
          informacion: estructurados
        });
      }

      // this.datosPrimitivos.push(...primitivos);
    }

    return this.menus;
  }

  obtenerMenu(): JsonMenu[]{
    return this.menus;
  }

}
