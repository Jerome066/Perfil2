import { JsonNode } from "./json-node";

export interface JsonMenu {
    option: string;
    contents: JsonNode[];
}
