import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JsonInfo } from '../../models/json-info';

interface Detalle {
  nivel: number;
  etiqueta: string;
  valor: string;
  tipo: string;
}

@Component({
  selector: 'app-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  readonly registro = inject<JsonInfo | null>(MAT_DIALOG_DATA, { optional: true });
  readonly detalles = this.aplanar(this.registro);

  private aplanar(registro: JsonInfo | null, nivel = 0): Detalle[] {
    if (!registro) return [];

    const actual: Detalle = {
      nivel,
      etiqueta: registro.etiqueta ?? registro.dato,
      valor: registro.dato,
      tipo: registro.tipoDato
    };
    return [actual, ...registro.sugDato.flatMap(hijo => this.aplanar(hijo, nivel + 1))];
  }
}
