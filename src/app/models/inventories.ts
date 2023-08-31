import { Inventory } from "./inventory";
import { Page } from "./Page";

export interface Inventories extends Page {
    inventories: Inventory[];
}