import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const numberPair = z.tuple([z.number(), z.number()]);
const numberPairArray = z.array(numberPair);
const numberPairArray3D = z.array(numberPairArray);

const schemaModeloTerritory = z.object({
  // Dados ModeloTerritory
  id: z.coerce.string().optional(),
  id_grupo: z.coerce.string().min(1, "Campo Obrigatório"),
  nome: z.coerce.string().min(1, "Campo Obrigatório"),
  numero: z.coerce.string().min(1, "Campo Obrigatório"),
  coordinates: numberPairArray3D,
});
export type ModeloTerritoryFormData = z.infer<typeof schemaModeloTerritory>;

export const useFormModeloTerritoryData = (data: ModeloTerritoryFormData) => {
  const form = useForm<ModeloTerritoryFormData>({
    resolver: zodResolver(schemaModeloTerritory),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
