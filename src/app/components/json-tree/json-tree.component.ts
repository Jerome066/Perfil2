import { Component, output, signal } from '@angular/core';
import { JsonNode } from '../../models/json-node';

@Component({
  selector: 'app-json-tree',
  imports: [],
  templateUrl: './json-tree.component.html',
  styleUrl: './json-tree.component.css'
})
export class JsonTreeComponent {
  jsonData = signal<unknown>(null);

  arbol = signal<JsonNode[]>([]);
  error = signal<string | null>(null);

  arbolConstruido = output<JsonNode[]>();

  async onFileSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      this.jsonData.set(parsed);

      const arbol = this.construirArbol(parsed);

      this.arbol.set(arbol);

      this.arbolConstruido.emit(arbol);

    } catch {
      this.error.set("JSON inválido");
      this.jsonData.set(null);
      this.arbol.set([]);
    }

  }

  construirArbol(dato: unknown, nombre = "ROOT", ruta = "", nivel = 0): JsonNode[] {
    const nodos: JsonNode[] = [];
    if (Array.isArray(dato)) {
      dato.forEach((item, index) => {
        nodos.push({
          nombre: `[${index}]`,
          ruta: ruta + `[${index}]`,
          nivel,
          tipo: Array.isArray(item) ? 'array' : item === null ? 'null' : typeof item as JsonNode['tipo'],
          valor: typeof item === 'object' ? undefined : item,
          hijos: this.construirArbol(item, `[${index}]`, ruta + `[${index}]`, nivel + 1)
        });
      });
    }
    else if (typeof dato === 'object' && dato !== null) {
      Object.entries(dato).forEach(([llave, valor]) => {
        nodos.push({
          nombre: llave,
          ruta: ruta ? `${ruta}.${llave}` : llave, nivel,
          tipo: Array.isArray(valor) ? 'array' : valor === null ? 'null' : typeof valor as JsonNode['tipo'],
          valor: typeof valor === 'object' ? undefined : valor,
          hijos: this.construirArbol(valor, llave, ruta ? `${ruta}.${llave}` : llave, nivel + 1)
        });
      });
    }
    return nodos;
  }
}
