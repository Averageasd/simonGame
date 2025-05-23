import { UUIDTypes } from "uuid";

export interface Cell {
  id: UUIDTypes;
  backgroundColor: string;
  selected: boolean;
}
