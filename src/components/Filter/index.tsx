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

interface FilterProps {
  codigoBoleta: string;
  cliente: string;
  fundo: string;
  situacoes: string[];
  tiposOperacao: string[];
  dataInicio: string;
  dataFim: string;
  valorMinimo: string;
  valorMaximo: string;
}

export function Filter() {
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
        valorMinimo: "",
        valorMaximo: "",
      },
    });

  const [clientes, setClientes] = useState<Option[]>([]);
  const [fundos, setFundos] = useState<Option[]>([]);
  const [situacoes, setSituacoes] = useState<Option[]>([]);
  const [valorMinimo, setValorMinimo] = useState<string>("");
  const [valorMaximo, setValorMaximo] = useState<string>("");

  const filters = watch();

  const formatarValor = (valor: string) => {
    const numValor = valor.replace(/[^\d]/g, "");
    const formatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(numValor) / 100);
    return formatado;
  };

  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setValorMinimo(valor);
    setValue("valorMinimo", valor.replace(/[^\d]/g, ""));
  };

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setValorMaximo(valor);
    setValue("valorMaximo", valor.replace(/[^\d]/g, ""));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsData, fundsData, situationsData] = await Promise.all([
          getClients() as Promise<{ nome: string; id: string }[]>,
          getFunds() as Promise<{ nome: string; id: string }[]>,
          getSituations() as Promise<{ nome: string; id: number }[]>,
        ]);

        setClientes(
          clientsData?.map((c) => ({
            label: c.nome,
            value: c.id,
          }))
        );

        setFundos(
          fundsData?.map((f: { nome: string; id: string }) => ({
            label: f.nome,
            value: f.id,
          }))
        );

        setSituacoes(
          situationsData?.map((s: { nome: string; id: number }) => ({
            label: s.nome,
            value: s.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar filtros:", error);
      }
    }

    fetchData();
  }, []);

  function onSubmit(data: FilterProps) {
    console.log("Filtros aplicados:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          options={clientes}
          value={filters.cliente}
          onChange={(value) => setValue("cliente", value)}
        />

        <Select
          label="Fundo"
          id="fund"
          name="fund"
          options={fundos}
          value={filters.fundo}
          onChange={(value) => setValue("fundo", value)}
        />

        <MultiSelect
          label="Situação"
          id="situation"
          name="situation"
          options={situacoes}
          value={filters.situacoes}
          onChange={(value) => setValue("situacoes", value)}
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
          {...register("valorMinimo")}
          placeholder="R$ 200,00"
          value={formatarValor(valorMinimo)}
          onChange={handleChangeMin}
        />

        <Input
          type="text"
          id="maximumValue"
          label="Valor Máximo"
          {...register("valorMaximo")}
          placeholder="R$ 1.000,00"
          value={formatarValor(valorMaximo)}
          onChange={handleChangeMax}
        />

        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Limpar Filtros
          </Button>
          <Button type="submit">Pesquisar</Button>
        </div>
      </div>
    </form>
  );
}
