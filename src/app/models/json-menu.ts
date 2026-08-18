import { JsonInfo } from "./json-info";
import { JsonNode } from "./json-node";

export interface JsonMenu {
    option: string;
    idReferencia: string;
    informacion: JsonInfo[] | JsonNode[];
}
