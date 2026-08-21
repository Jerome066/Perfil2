import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { JsonInfo } from '../../models/json-info';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private dialog = inject(MatDialog);
  registros = input<JsonInfo[]>([]);

  camposVisibles(registro: JsonInfo): JsonInfo[] {
    return registro.esTitulo
      ? registro.sugDato.filter(campo => !campo.esTitulo).slice(0, 5)
      : [registro];
  }

  titulo(registro: JsonInfo): string {
    return registro.esTitulo ? registro.dato : (registro.etiqueta ?? 'Registro');
  }

  abrirDetalle(registro: JsonInfo): void {
    this.dialog.open(DialogComponent, { data: registro, width: '740px', maxWidth: '95vw' });
  }
}
