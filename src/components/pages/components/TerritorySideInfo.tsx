import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Ban, Save } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../ui/button";
import { useStoreTerritory } from "../territory/store";
import { ModeloTerritoryFormData, useFormModeloTerritoryData } from "./form-data";
const TerritorySideInfo = ({ removeFeature }: { removeFeature: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const sideInfoOpen = useStoreTerritory().sideInfoOpen;
  const closeSideInfo = useStoreTerritory().closeSideInfo;
  const id = useStoreTerritory().id;
  const coordinates = useStoreTerritory().coordinates;
  const setTerritories = useStoreTerritory().setTerritories;
  const { form } = useFormModeloTerritoryData({
    id: id || "",
    id_grupo: "",
    nome: "",
    numero: "",
    coordinates,
  });
  // const handleCopyLink = () => {
  //   const link = "TESTE";
  //   navigator.clipboard.writeText(link);
  //   toast({
  //     title: "Link copied!",
  //     description: "The territory link has been copied to your clipboard.",
  //   });
  // };

  function onSubmit(data: ModeloTerritoryFormData) {
    console.log(data);
    setTerritories({
      id: data.numero,
      id_grupo: data.id_grupo,
      nome: data.nome,
      numero: data.numero,
      coordenadas: coordinates,
    });
    closeSideInfo();
  }

  return (
    <Sheet onOpenChange={closeSideInfo} open={sideInfoOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar Território</SheetTitle>
          <SheetDescription>
            Coloque aqui todos os dados referentes ao território a ser criado
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            ref={formRef}
            className="flex flex-col gap-2 py-4 z-[100]"
          >
            <FormInput
              name="nome"
              label="Nome"
              className={"flex-1 min-w-[15ch]"}
              control={form.control}
            />
            <FormInput
              name="numero"
              label="Número"
              className={"flex-1 min-w-[15ch]"}
              control={form.control}
              type="number"
              step="1"
            />
            <FormSelect
              name="id_grupo"
              label="Grupo"
              control={form.control}
              options={[
                {
                  value: "1",
                  label: "Messias",
                },
                {
                  value: "2",
                  label: "Domicio",
                },
                {
                  value: "3",
                  label: "Salão do Reino",
                },
                {
                  value: "4",
                  label: "José Roberto",
                },
              ]}
              className="flex-1"
            />
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant={"secondary"} onClick={removeFeature}>
              <Ban size={18} className="me-2" />
              Fechar
            </Button>
          </SheetClose>
          <Button
            onClick={() => {
              formRef.current?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }}
          >
            <Save size={18} className="me-2" />
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TerritorySideInfo;
