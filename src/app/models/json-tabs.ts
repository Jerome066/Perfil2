import { JsonMenu } from "./json-menu";
import { JsonNode } from "./json-node";

export interface JsonTabs {
    tabName: string;
    valor: string;
    menuOpt:JsonNode[];
}
