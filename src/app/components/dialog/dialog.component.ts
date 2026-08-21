import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JsonInfo } from '../../models/json-info';

type TipoContenido = 'imagen' | 'documento' | 'link' | 'grupo' | 'texto';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  readonly registro = inject<JsonInfo | null>(MAT_DIALOG_DATA, { optional: true });

  hijoUri(nodo: JsonInfo): JsonInfo | undefined {
    return nodo.sugDato?.find(h => h.etiqueta === 'uri');
  }

  hijoContentType(nodo: JsonInfo): JsonInfo | undefined {
    return nodo.sugDato?.find(h => h.etiqueta === 'contentType');
  }

  esGrupoMedia(nodo: JsonInfo): boolean {
    return nodo.tipoDato === 'object' && !!this.hijoUri(nodo);
  }

  urlMedia(nodo: JsonInfo): string {
    return this.hijoUri(nodo)?.dato ?? nodo.dato;
  }

  tipoContenido(nodo: JsonInfo): TipoContenido {
    if (this.esGrupoMedia(nodo)) {
      const ct = (this.hijoContentType(nodo)?.dato ?? '').toLowerCase();
      const url = this.urlMedia(nodo);

      if (ct.startsWith('image/') || this.esImagen(url)) return 'imagen';
      if (this.esContentTypeDocumento(ct) || this.esDocumento(url)) return 'documento';
      return 'link';
    }

    if (nodo.tipoDato === 'object') {
      return 'grupo';
    }

    if (this.esImagen(nodo.dato)) return 'imagen';
    if (this.esDocumento(nodo.dato)) return 'documento';
    if (this.esLink(nodo.dato)) return 'link';
    return 'texto';
  }

  esContentTypeDocumento(contentType: string): boolean {
    const tiposDocumento = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'text/csv',
      'text/plain'
    ];
    return tiposDocumento.includes(contentType) || contentType.startsWith('application/vnd.');
  }

  esImagen(valor: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff?)(\?.*)?$/i.test((valor ?? '').trim());
  }

  esDocumento(valor: string): boolean {
    return /\.(pdf|docx?|xlsx?|pptx?|txt|csv|odt|ods|odp)(\?.*)?$/i.test((valor ?? '').trim());
  }

  esLink(valor: string): boolean {
    return /^(https?:\/\/|www\.)[^\s]+$/i.test((valor ?? '').trim());
  }
}