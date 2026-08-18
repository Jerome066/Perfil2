import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { JsonTreeComponent } from '../json-tree/json-tree.component';
import { JsonTabsComponent } from '../json-tabs/json-tabs.component';
import { JsonInformationComponent } from '../json-information/json-information.component';
import { JsonServiceService } from '../../services/json-service.service';
import { JsonTabs } from '../../models/json-tabs';
import { JsonNode } from '../../models/json-node';
import { JsonMenu } from '../../models/json-menu';
import { JsonInfo } from '../../models/json-info';

@Component({
  selector: 'app-json-perfil-main',
  imports: [JsonTreeComponent, MatTabsModule, MatPaginatorModule, JsonTabsComponent, FormsModule, JsonInformationComponent],
  templateUrl: './json-perfil-main.component.html',
  styleUrl: './json-perfil-main.component.css'
})
export class JsonPerfilMainComponent {
  private datosArbol = inject(JsonServiceService);
  private arbol = signal<JsonNode[]>([]);

  tieneArchivo = signal(false);
  tabs = signal<JsonTabs[]>([]);
  menus = signal<JsonMenu[]>([]);
  tabActual = signal(0);
  opcionSeleccionada = signal<JsonMenu | null>(null);
  registros = signal<JsonInfo[]>([]);
  terminoBusqueda = signal('');
  pageSize = signal(5);
  pageIndex = signal(0);
  
  registrosFiltrados = computed(() =>
    this.datosArbol.filtrarRegistros(this.registros(), this.terminoBusqueda())
  );
  registrosPaginados = computed(() => {
    const inicio = this.pageIndex() * this.pageSize();
    return this.registrosFiltrados().slice(inicio, inicio + this.pageSize());
  });

  obtenerArbol(arbol: JsonNode[]): void {
    this.arbol.set(arbol);
    this.tabs.set(this.datosArbol.obtenerTabs(arbol));
    this.tieneArchivo.set(arbol.length > 0);
    this.actualizarTab(0);
  }

  actualizarTab(indice: number): void {
    this.tabActual.set(indice);
    const opciones = this.datosArbol.actualizarMenu(indice);
    this.menus.set(opciones);
    this.terminoBusqueda.set('');
    this.pageIndex.set(0);

    if (opciones.length > 0) {
      this.seleccionarOpcion(opciones[0]);
      return;
    }

    this.opcionSeleccionada.set(null);
    this.registros.set(this.datosArbol.obtenerDatosPrimitivos());
  }

  seleccionarOpcion(opcion: JsonMenu): void {
    this.opcionSeleccionada.set(opcion);
    this.pageIndex.set(0);
    const registrosOpcion = this.datosArbol.obtenerRegistros([opcion.informacion]);
    const registrosPaginables = opcion.informacion.tipo === 'array'
      ? (registrosOpcion[0]?.sugDato ?? [])
      : registrosOpcion;

    this.registros.set([
      ...this.datosArbol.obtenerDatosPrimitivos(),
      ...registrosPaginables
    ]);
  }

  formatoString(cadena: string): string {
    return this.datosArbol.formarString(cadena);
  }

  actualizarFiltro(termino: string): void {
    this.terminoBusqueda.set(termino);
    this.pageIndex.set(0);
  }

  cambiarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
  }
}
