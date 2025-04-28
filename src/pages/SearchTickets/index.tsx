import { Filter } from "@/components/Filter";
import { useState, useEffect } from "react";
import { Table } from "@/components/Table";
import { FilterProps } from "@/components/Filter";
import { searchTickets } from "@/services/api";

interface DataRow {
  codigoBoleta: string;
  idCliente: string;
  cpfCnpjCliente: string;
  nomeCliente: string;
  idFundo: string;
  cnpjFundo: string;
  nomeFundo: string;
  nomeSituacao: string;
  descricaoTipoOperacao: string;
  dataOperacao: string;
  valorFinanceiro: number;
  idSituacao: number;
  codigoTipoOperacao: string;
}

export function SearchTickets() {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const totalItems = data.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = (await searchTickets()) as { elementos: DataRow[] };
        setData(result.elementos);
        setFilteredData(result.elementos);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setError(
          "Erro ao carregar as informações. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const applyFilter = (filter: FilterProps) => {
    const filtered = data.filter((item) => {
      const validations = [
        !filter.cliente || item.idCliente === filter.cliente,
        !filter.codigoBoleta || item.codigoBoleta === filter.codigoBoleta,
        !filter.fundo || item.idFundo === filter.fundo,
        filter.situacoes.length === 0 ||
          (filter.situacoes.length > 0 &&
            filter.situacoes.includes(item.idSituacao)),
        filter.tiposOperacao.length === 0 ||
          (filter.tiposOperacao.length > 0 &&
            filter.tiposOperacao.includes(item.codigoTipoOperacao)),
        !filter.dataInicio ||
          new Date(item.dataOperacao) >= new Date(filter.dataInicio),
        !filter.dataFim ||
          new Date(item.dataOperacao) <= new Date(filter.dataFim),
        filter.valorMinimo === null ||
          item.valorFinanceiro >= filter.valorMinimo,
        filter.valorMaximo === null ||
          item.valorFinanceiro <= filter.valorMaximo,
      ];
      return validations.every(Boolean);
    });

    setFilteredData(filtered);
  };

  const handleSubmit = (filters: FilterProps) => {
    applyFilter(filters);
  };

  const columns = [
    { key: "codigoBoleta", label: "Código da Boleta" },
    { key: "idCliente", label: "Identificador do Cliente" },
    { key: "cpfCnpjCliente", label: "CPF/CNPJ do Cliente" },
    { key: "nomeCliente", label: "Nome do Cliente" },
    { key: "idFundo", label: "Identificador do Fundo" },
    { key: "cnpjFundo", label: "CNPJ do Fundo" },
    { key: "nomeFundo", label: "Nome do Fundo" },
    { key: "nomeSituacao", label: "Situação" },
    { key: "descricaoTipoOperacao", label: "Tipo de Operação" },
    { key: "dataOperacao", label: "Data da Operação" },
    {
      key: "valorFinanceiro",
      label: "Valor Financeiro",
      format: (value: string | number | string[]) =>
        typeof value === "number"
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          : Array.isArray(value)
          ? value.join(", ")
          : value,
    },
  ];

  return (
    <div
      className="flex flex-col gap-4"
      style={{ maxWidth: "1700px", margin: "0 auto" }}
    >
      <h1 className="text-2xl">Boletas de Cotas de Fundos</h1>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-[8px] shadow-md">
        <Filter onSubmit={handleSubmit} />
      </div>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-[8px] shadow-md">
        <Table
          data={filteredData}
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          columns={columns}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}
