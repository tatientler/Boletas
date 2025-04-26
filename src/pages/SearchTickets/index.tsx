import { Filter } from "@/components/Filter";

export function SearchTickets() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Boletas de Cotas de Fundos</h1>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-[8px] shadow-md">
        <Filter />
      </div>
    </div>
  );
}
