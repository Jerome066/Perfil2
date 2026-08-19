import { Injectable } from '@angular/core';
import { JsonNode } from '../models/json-node';
import { JsonTabs } from '../models/json-tabs';
import { JsonMenu } from '../models/json-menu';
import { JsonInfo } from '../models/json-info';

@Injectable({
  providedIn: 'root'
})
export class JsonServiceService {
  private tabs: JsonTabs[] = [];
  private menus: JsonMenu[] = [];
  private datosPrimitivos: JsonNode[] = [];

  nuevoArchivo(): void {
    this.tabs = [];
    this.menus = [];
    this.datosPrimitivos = [];
  }

  obtenerTabs(nodos: JsonNode[]): JsonTabs[] {
    this.nuevoArchivo();
    this.tabs = nodos.map(tab => ({
      tabName: tab.nombre,
      menuOpt: tab.hijos
    }));
    return this.tabs;
  }

  actualizarMenu(num: number): JsonMenu[] {
    const tab = this.tabs[num];
    this.menus = [];
    this.datosPrimitivos = [];

    if (!tab) {
      return this.menus;
    }

    for (const nodo of tab.menuOpt) {
      if (nodo.tipo === 'object' || nodo.tipo === 'array') {
        this.menus.push({
          option: nodo.nombre,
          idReferencia: tab.tabName,
          informacion: nodo
        });
      } else {
        this.datosPrimitivos.push(nodo);
      }
    }
    return this.menus;
  }

  obtenerMenu(): JsonMenu[] {
    return this.menus;
  }

  obtenerDatosPrimitivos(): JsonInfo[] {
    return this.datosPrimitivos.map(nodo => this.tratarPrimitivo(nodo));
  }

  obtenerRegistros(nodos: JsonNode[]): JsonInfo[] {

    const registros: JsonInfo[] = [];

    for (const nodo of nodos) {
      switch (nodo.tipo) {
        case 'object':
          registros.push(...this.tratarObject(nodo));
          break;
        case 'array':
          registros.push(...this.tratarArray(nodo));
          break;
        case 'string':
        case 'number':
        case 'boolean':
        case 'null':
          registros.push(this.tratarPrimitivo(nodo));
          break;
      }
    }

    return registros;
  }

  private tratarPrimitivo(nodo: JsonNode): JsonInfo {

    return {
      esTitulo: false,
      etiqueta: nodo.nombre,
      dato: nodo.valor === null ? 'null' : String(nodo.valor),
      tipoDato: nodo.tipo,
      sugDato: []
    };

  }

  private tratarObject(nodo: JsonNode): JsonInfo[] {

    const informacion: JsonInfo[] = [];

    const titulo: JsonInfo = {
      esTitulo: true,
      etiqueta: nodo.nombre,
      dato: nodo.nombre,
      tipoDato: 'object',
      sugDato: []
    };

    for (const hijo of nodo.hijos) {
      const registrosHijo = this.obtenerRegistros([hijo]);
      titulo.sugDato.push(...registrosHijo);
    }

    informacion.push(titulo);
    return informacion;
  }

  private tratarArray(nodo: JsonNode): JsonInfo[] {
    if (nodo.hijos.length === 0) {
      return [];
    }
    if (this.esArrayDePrimitivos(nodo.hijos)) {
      return this.tratarArrayDePrimitivos(nodo);
    }
    if (this.esArrayDeObjetos(nodo.hijos)) {
      return this.tratarArrayDeObjetos(nodo);
    }
    if (this.esArrayDeArrays(nodo.hijos)) {
      return this.tratarArrayDeArrays(nodo);
    }
    return this.tratarArrayMixto(nodo);
  }

  private tratarArrayDePrimitivos(nodo: JsonNode): JsonInfo[] {

    const informacion: JsonInfo = {
      esTitulo: true,
      etiqueta: nodo.nombre,
      dato: nodo.nombre,
      tipoDato: 'array',
      sugDato: []
    };

    for (const hijo of nodo.hijos) {
      informacion.sugDato.push(
        this.tratarPrimitivo(hijo)
      );
    }
    return [informacion];
  }

  private esArrayDePrimitivos(nodos: JsonNode[]): boolean {
    return nodos.every(nodo =>
      nodo.tipo === 'string' ||
      nodo.tipo === 'number' ||
      nodo.tipo === 'boolean' ||
      nodo.tipo === 'null'
    );
  }

  private esArrayDeObjetos(nodos: JsonNode[]): boolean {
    return nodos.length > 0 &&
      nodos.every(nodo => nodo.tipo === 'object');
  }

  private esArrayDeArrays(nodos: JsonNode[]): boolean {
    return nodos.length > 0 &&
      nodos.every(nodo => nodo.tipo === 'array');
  }

  private tratarArrayDeArrays(nodo: JsonNode): JsonInfo[] {
    // Pendiente de definir la representación.
    return this.tratarArrayMixto(nodo);

  }

  private tratarArrayMixto(nodo: JsonNode): JsonInfo[] {

    const informacion: JsonInfo = {
      esTitulo: true,
      etiqueta: nodo.nombre,
      dato: nodo.nombre,
      tipoDato: 'array',
      sugDato: []
    };

    for (const hijo of nodo.hijos) {
      informacion.sugDato.push(
        ...this.obtenerRegistros([hijo])
      );
    }
    return [informacion];
  }

  private tratarArrayDeObjetos(nodo: JsonNode): JsonInfo[] {

    const informacion: JsonInfo = {
      esTitulo: true,
      etiqueta: nodo.nombre,
      dato: nodo.nombre,
      tipoDato: 'array-object',
      sugDato: []
    };

    for (const objeto of nodo.hijos) {
      const registrosObjeto = this.obtenerRegistros([objeto]);
      informacion.sugDato.push(...registrosObjeto);
    }

    return [informacion];
  }

  filtrarRegistros(registros: JsonInfo[], termino: string): JsonInfo[] {
    const busqueda = termino.trim().toLocaleLowerCase();
    if (!busqueda) {
      return registros;
    }

    return registros.flatMap(registro => this.filtrarRegistro(registro, busqueda));
  }

  private filtrarRegistro(registro: JsonInfo, busqueda: string): JsonInfo[] {
    const hijos = registro.sugDato.flatMap(hijo => this.filtrarRegistro(hijo, busqueda));
    const coincide = `${registro.etiqueta ?? ''} ${registro.dato}`
      .toLocaleLowerCase()
      .includes(busqueda);

    if (!coincide && hijos.length === 0) {
      return [];
    }

    return [{ ...registro, sugDato: coincide ? registro.sugDato : hijos }];
  }



  ////////////////////////// FORMATOS //////////////////////////

  formarString(key: string): string {
    const withSpaces = key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
      .replace(/[_-]/g, ' ');               // snake_case / kebab-case
    return withSpaces
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }


}
