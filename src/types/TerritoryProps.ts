import { GroupProps } from "./GroupProps";

export interface TerritoryProps {
  id?: string;
  nome: string;
  numero: string;
  id_grupo: string;
  grupo?: GroupProps;
  coordenadas: [number, number][][];
}
