import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { JsonInfo } from '../../models/json-info';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  private dialog = inject(MatDialog);
  registros = input<JsonInfo[]>([]);
  filas = computed(() => this.obtenerFilas(this.registros()));
  columnas = computed(() => {
    const nombres = new Set<string>();
    for (const registro of this.filas()) {
      for (const campo of this.camposVisibles(registro)) {
        nombres.add(campo.etiqueta ?? campo.dato);
        if (nombres.size === 5) return [...nombres];
      }
    }
    return [...nombres];
  });

  valor(registro: JsonInfo, columna: string): string {
    return this.camposVisibles(registro)
      .find(campo => (campo.etiqueta ?? campo.dato) === columna)?.dato ?? '—';
  }

  etiqueta(columna: string): string {
    return columna.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ');
  }

  abrirDetalle(registro: JsonInfo): void {
    this.dialog.open(DialogComponent, { data: registro, width: '740px', maxWidth: '95vw' });
  }

  private camposVisibles(registro: JsonInfo): JsonInfo[] {
    return registro.esTitulo
      ? registro.sugDato.filter(campo => !campo.esTitulo).slice(0, 5)
      : [registro];
  }

  private obtenerFilas(registros: JsonInfo[]): JsonInfo[] {
    return registros.flatMap(registro => {
      if (!registro.esTitulo || this.camposVisibles(registro).length > 0) {
        return [registro];
      }
      // En caso de no tener columnas propias: se bajan sus hijos hasta encontrar registros útiles.
      return this.obtenerFilas(registro.sugDato);
    });
  }
}
