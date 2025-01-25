import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Expand, Pen, PenOff, Search, Shrink, Trash } from "lucide-react";
import { Feature } from "ol";
import Map from "ol/Map";
import View from "ol/View";
import { Polygon } from "ol/geom";
import Draw from "ol/interaction/Draw";
import Select from "ol/interaction/Select";
import { Tile as TileLayer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { transformExtent } from "ol/proj";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text } from "ol/style";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStoreTerritory } from "../territory/store";
import TerritorySideInfo from "./TerritorySideInfo";

const MapComponent = ({ canEdit }: { canEdit?: boolean }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [draw, setDraw] = useState<Draw | null>(null);
  const [vectorSource] = useState(new VectorSource());
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Camada vetorial inicializada diretamente
  const vectorLayer = useMemo(
    () =>
      new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
          stroke: new Stroke({ color: "blue", width: 1 }),
        }),
      }),
    []
  );
  const [selectedFeature, setSelectedFeature] = useState<Feature<Polygon> | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const territories = useStoreTerritory().territories;
  const openSideInfo = useStoreTerritory().openSideInfo;

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, [vectorLayer]);

  useEffect(() => {
    if (map) {
      const selectInteraction = new Select();
      map.addInteraction(selectInteraction);

      selectInteraction.on("select", (event) => {
        if (event.selected.length > 0) {
          const feature = event.selected[0] as Feature<Polygon>;
          setSelectedFeature(feature);
          const territory = territories.find((t) =>
            t.coordenadas.some(
              (coordSet, index) =>
                JSON.stringify(coordSet) ===
                JSON.stringify(feature.getGeometry()?.getCoordinates()[index])
            )
          );

          if (territory) {
            console.log("Território selecionado:", territory);
            // changeTerritoryPropsColor(feature, "rgba(255, 0, 0, 0.5)");
          }
        } else {
          setSelectedFeature(null);
        }
      });
    }
  }, [map, territories]);

  useEffect(() => {
    if (!map || !territories.length) return;

    // Limpar polígonos existentes
    vectorSource.clear();

    // Adicionar novos polígonos com base nas coordenadas de `territories`
    territories.forEach((territory, index) => {
      const polygon = new Feature({
        geometry: new Polygon(territory.coordenadas),
        id: index, // Adiciona um identificador único ao polígono
      });

      // Estilo inicial (sem label)
      polygon.setStyle(
        new Style({
          fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
          stroke: new Stroke({ color: "blue", width: 1 }),
        })
      );

      vectorSource.addFeature(polygon);
    });

    // Função para alterar o estilo ao passar o mouse
    const handlePointerMove = (event: any) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature instanceof Feature) {
          // Destacar o polígono com a label
          const territoryIndex = feature.get("id");
          const territory = territories[territoryIndex];

          feature.setStyle(
            new Style({
              fill: new Fill({ color: "rgba(0, 0, 255, 0.2)" }),
              stroke: new Stroke({ color: "blue", width: 2 }),
              text: new Text({
                text: `${territory.numero} - ${territory.nome}`,
                font: "12px Arial, sans-serif",
                fill: new Fill({ color: "#000" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
                scale:
                  parseFloat(String(map && map.getView() && map.getView().getZoom()) || "1") / 10, // Verificação para evitar 'undefined'
                overflow: true,
              }),
            })
          );
        }
      });

      // Remover a label dos polígonos que não estão em hover
      vectorSource.getFeatures().forEach((feature) => {
        if (
          feature instanceof Feature &&
          feature !== map.forEachFeatureAtPixel(event.pixel, (f) => f)
        ) {
          feature.setStyle(
            new Style({
              fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }),
              stroke: new Stroke({ color: "blue", width: 1 }),
            })
          );
        }
      });
    };

    // Adicionar o evento ao mapa
    map.on("pointermove", handlePointerMove);

    // Limpar evento ao desmontar
    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [territories, map, vectorSource]);

  useEffect(() => {
    if (territories.length && map) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, { padding: [20, 20, 20, 20] });
    }
  }, [territories, map, vectorSource]);

  // const changeTerritoryPropsColor = (feature: Feature<Polygon>, color: string) => {
  //   feature.setStyle(
  //     new Style({
  //       fill: new Fill({ color }),
  //       stroke: new Stroke({ color: "red", width: 2 }),
  //     })
  //   );
  // };

  const removeSelectedFeature = useCallback(() => {
    if (selectedFeature) {
      vectorSource.removeFeature(selectedFeature);
      setSelectedFeature(null);
    } else {
      alert("Nenhum polígono selecionado para remover.");
    }
  }, [vectorSource, selectedFeature]);

  const startDrawing = () => {
    if (!map || draw) return;

    const drawInteraction = new Draw({
      source: vectorSource,
      type: "Polygon",
    });

    drawInteraction.on("drawend", (event) => {
      const polygon = event.feature as Feature<Polygon>;
      const geometry = polygon.getGeometry();
      const coordinates = geometry?.getCoordinates() as [number, number][][];

      if (coordinates) {
        openSideInfo({ id: "", coordinates });
      }
      // Definir o polígono recém-desenhado como selecionado
      setSelectedFeature(polygon);
      stopDrawing();
    });

    map.addInteraction(drawInteraction);
    setDraw(drawInteraction);
  };

  const stopDrawing = () => {
    if (map && draw) {
      map.removeInteraction(draw);
      setDraw(null);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      startDrawing();
    } else {
      stopDrawing();
    }
  };

  function toggleFullScreen() {
    if (!mapRef.current) {
      console.error("Elemento do mapa não encontrado.");
      return;
    }

    if (!document.fullscreenElement) {
      // Solicitar tela cheia
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      // Sair do modo de tela cheia
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchQuery,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });

      if (response.data.length > 0 && map) {
        const { boundingbox } = response.data[0];
        const view = map.getView();

        // Converter o bounding box de EPSG:4326 para EPSG:3857
        const extent = transformExtent(
          [
            parseFloat(boundingbox[2]), // west_lon
            parseFloat(boundingbox[0]), // south_lat
            parseFloat(boundingbox[3]), // east_lon
            parseFloat(boundingbox[1]), // north_lat
          ],
          "EPSG:4326",
          "EPSG:3857"
        );

        // Calcular o centro do bounding box
        const center = [
          (parseFloat(boundingbox[2]) + parseFloat(boundingbox[3])) / 2, // média dos longitudes
          (parseFloat(boundingbox[0]) + parseFloat(boundingbox[1])) / 2, // média das latitudes
        ];

        // Converter o centro para EPSG:3857
        const transformedCenter = transformExtent(center, "EPSG:4326", "EPSG:3857");

        // Ajustar o mapa para o bounding box com animação
        view.fit(extent, { duration: 1000, padding: [20, 20, 20, 20] });

        // Opcional: Animação adicional para o centro
        view.animate({
          center: transformedCenter,
          duration: 1000,
        });
      } else {
        alert("Localização não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar a localização:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 max-w-7xl mx-auto">
        {/* <LocationSearchBar /> */}
        <div className="flex">
          <Input
            type="text"
            placeholder="Pesquisar localização..."
            className="h-10 rounded-none rounded-l-md bg-secondary/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch} variant={"tertiary"} className="rounded-none rounded-r-md">
            <Search size={18} />
          </Button>
        </div>
        <div ref={mapRef} className="w-full h-[70vh] relative rounded-md overflow-clip bg-white">
          {canEdit && (
            <>
              <Button
                variant={isEditing ? "destructive" : "default"}
                size={"sm"}
                onClick={toggleEditMode}
                className="absolute z-50 m-3 top-0 right-0 rounded-full"
              >
                {isEditing ? <PenOff size={14} /> : <Pen size={14} />}
              </Button>
              <Button
                onClick={removeSelectedFeature}
                variant="destructive"
                size="sm"
                disabled={!selectedFeature}
                className="absolute z-50 m-3 top-10 right-0 rounded-full disabled:opacity-0 transition-all"
              >
                <Trash size={14} />
              </Button>
            </>
          )}
          <div className="absolute bottom-2 right-2 z-50">
            <Button variant={"secondary"} size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      <TerritorySideInfo removeFeature={removeSelectedFeature} />
    </>
  );
};

export default MapComponent;
