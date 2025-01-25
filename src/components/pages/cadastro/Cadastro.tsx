import MapComponent from "../components/MapComponent";

const Cadastro = () => {
  return (
    <div className="flex flex-col min-w-full gap-2">
      <div>
        <MapComponent canEdit />
      </div>
    </div>
  );
};

export default Cadastro;
