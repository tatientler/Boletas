import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../Input";
import { Select } from "../Select";
import { MultiSelect } from "../MultiSelect";
import { DatePicker } from "../DatePicker";
import { Button } from "@/components/ui/button";
import { getClients, getFunds, getSituations } from "../../services/api";

interface Option {
  label: string;
  value: string;
}

export interface FilterProps {
  codigoBoleta: string;
  cliente: string;
  fundo: string;
  situacoes: number[];
  tiposOperacao: string[];
  dataInicio: string;
  dataFim: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
}

interface FilterComponentProps {
  onSubmit: (filters: FilterProps) => void;
}

export function Filter({ onSubmit }: FilterComponentProps) {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FilterProps>({
      defaultValues: {
        codigoBoleta: "",
        cliente: "",
        fundo: "",
        situacoes: [],
        tiposOperacao: [],
        dataInicio: "",
        dataFim: "",
        valorMinimo: null,
        valorMaximo: null,
      },
    });

  const [clients, setClients] = useState<Option[]>([]);
  const [funds, setFunds] = useState<Option[]>([]);
  const [situations, setSituations] = useState<Option[]>([]);
  const [minimumValue, setMinimumValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const filters = watch();

  const formatValueAsCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (!onlyNumbers) return "";

    const numericValue = Number(onlyNumbers) / 100;

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanedNumericInput = inputValue.replace(/\D/g, "");

    const numericValue = cleanedNumericInput
      ? parseFloat((Number(cleanedNumericInput) / 100).toFixed(2))
      : null;

    setMinimumValue(inputValue);
    setValue("valorMinimo", numericValue);
  };

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanedNumericInput = inputValue.replace(/\D/g, "");

    const numericValue = cleanedNumericInput
      ? parseFloat((Number(cleanedNumericInput) / 100).toFixed(2))
      : null;

    setMaxValue(inputValue);
    setValue("valorMaximo", numericValue);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsData, fundsData, situationsData] = await Promise.all([
          getClients() as Promise<{ nome: string; id: string }[]>,
          getFunds() as Promise<{ nome: string; id: string }[]>,
          getSituations() as Promise<{ nome: string; id: number }[]>,
        ]);

        setClients(
          clientsData?.map((c) => ({
            label: c.nome,
            value: c.id,
          }))
        );

        setFunds(
          fundsData?.map((f: { nome: string; id: string }) => ({
            label: f.nome,
            value: f.id,
          }))
        );

        setSituations(
          situationsData?.map((s: { nome: string; id: number }) => ({
            label: s.nome,
            value: s.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar filtros:", error);
        setError("Erro ao carregar os filtros. Tente novamente mais tarde.");
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  function handleClearFilters() {
    reset();
    setMinimumValue("");
    setMaxValue("");
  }

  return (
    <form onSubmit={handleSubmit(() => onSubmit(filters))}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Input
          type="number"
          id="codigoBoleta"
          label="Código da Boleta"
          {...register("codigoBoleta")}
          placeholder="Ex: 123456"
        />

        <Select
          label="Cliente"
          id="client"
          name="client"
          options={clients}
          value={filters.cliente}
          onChange={(value) => setValue("cliente", value)}
        />

        <Select
          label="Fundo"
          id="fund"
          name="fund"
          options={funds}
          value={filters.fundo}
          onChange={(value) => setValue("fundo", value)}
        />

        <MultiSelect
          label="Situação"
          id="situation"
          name="situation"
          options={situations}
          value={filters.situacoes.map(String)}
          onChange={(value) => setValue("situacoes", value.map(Number))}
          limitSelectedValues={3}
        />

        <MultiSelect
          label="Tipo de Operação"
          id="operationType"
          name="operationType"
          options={[
            { label: "Aplicação", value: "A" },
            { label: "Resgate Parcial", value: "RP" },
            { label: "Resgate Total", value: "RT" },
          ]}
          value={filters.tiposOperacao}
          onChange={(value) => setValue("tiposOperacao", value)}
        />

        <DatePicker
          label="Data de Início"
          value={filters.dataInicio}
          onChange={(value) => setValue("dataInicio", value)}
        />

        <DatePicker
          label="Data de Fim"
          value={filters.dataFim}
          onChange={(value) => setValue("dataFim", value)}
        />

        <Input
          type="text"
          id="minimumValue"
          label="Valor Mínimo"
          placeholder="R$ 200,00"
          value={formatValueAsCurrency(minimumValue)}
          onChange={(e) => handleChangeMin(e)}
        />

        <Input
          type="text"
          id="maximumValue"
          label="Valor Máximo"
          placeholder="R$ 1.000,00"
          value={formatValueAsCurrency(maxValue)}
          onChange={(e) => handleChangeMax(e)}
        />

        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
          <Button type="submit">Pesquisar</Button>
        </div>
      </div>
    </form>
  );
}
