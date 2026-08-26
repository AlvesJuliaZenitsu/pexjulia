"use client";

import React, { useState, useMemo } from "react";

// Tipagem das entidades do sistema
interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  quantidadeMinima: number;
  precoUnitario: number;
  unidadeMedida: string; // ex: ml, un, caixa, frasco
}

interface Movimentacao {
  id: string;
  produtoNome: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  dataHora: string;
  motivo: string;
}

export default function GerenciamentoEstoquePage() {
  // Estado inicial simulado de produtos da clínica de estética
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: "1",
      nome: "Ácido Hialurônico 2ml",
      categoria: "Dermatológicos",
      quantidade: 3,
      quantidadeMinima: 5,
      precoUnitario: 180.0,
      unidadeMedida: "frasco",
    },
    {
      id: "2",
      nome: "Luvas de Nitrilo Rosa (M)",
      categoria: "Descartáveis",
      quantidade: 12,
      quantidadeMinima: 4,
      precoUnitario: 45.0,
      unidadeMedida: "caixa",
    },
    {
      id: "3",
      nome: "Máscara Gel Calmante 500g",
      categoria: "Cosméticos",
      quantidade: 8,
      quantidadeMinima: 2,
      precoUnitario: 89.9,
      unidadeMedida: "pote",
    },
    {
      id: "4",
      nome: "Agulhas para Preenchimento 30G",
      categoria: "Descartáveis",
      quantidade: 2,
      quantidadeMinima: 10,
      precoUnitario: 15.0,
      unidadeMedida: "un",
    },
  ]);

  const [historico, setHistorico] = useState<Movimentacao[]>([]);

  // Filtros e Formulários
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODAS");

  // Estados para Registro de Movimentação
  const [produtoIdSel, setProdutoIdSel] = useState("");
  const [tipoMov, setTipoMov] = useState<"ENTRADA" | "SAIDA">("SAIDA");
  const [qtdMov, setQtdMov] = useState<number>(1);
  const [motivoMov, setMotivoMov] = useState("");

  // Lógica de Movimentação do Estoque
  const handleRegistrarMovimentacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoIdSel || qtdMov <= 0) {
      alert("Por favor, selecione um produto e informe uma quantidade válida.");
      return;
    }

    const produtoAlvo = produtos.find((p) => p.id === produtoIdSel);
    if (!produtoAlvo) return;

    if (tipoMov === "SAIDA" && produtoAlvo.quantidade < qtdMov) {
      alert(
        `Quantidade insuficiente em estoque! Saldo atual: ${produtoAlvo.quantidade}`,
      );
      return;
    }

    // Atualiza a quantidade do produto
    setProdutos((prev) =>
      prev.map((p) => {
        if (p.id === produtoIdSel) {
          const novaQtd =
            tipoMov === "ENTRADA"
              ? p.quantidade + qtdMov
              : p.quantidade - qtdMov;
          return { ...p, quantidade: novaQtd };
        }
        return p;
      }),
    );

    // Adiciona ao Histórico
    const novaMov: Movimentacao = {
      id: Date.now().toString(),
      produtoNome: produtoAlvo.nome,
      tipo: tipoMov,
      quantidade: qtdMov,
      dataHora: new Date().toLocaleString("pt-BR"),
      motivo:
        motivoMov ||
        (tipoMov === "SAIDA" ? "Atendimento Clínico" : "Reposição de Estoque"),
    };

    setHistorico([novaMov, ...historico]);

    // Reseta o formulário
    setQtdMov(1);
    setMotivoMov("");
    alert("Movimentação registrada com sucesso!");
  };

  // Filtros calculados
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const bateNome = p.nome.toLowerCase().includes(busca.toLowerCase());
      const bateCategoria =
        categoriaFiltro === "TODAS" || p.categoria === categoriaFiltro;
      return bateNome && bateCategoria;
    });
  }, [produtos, busca, categoriaFiltro]);

  // Produtos em estado crítico (Abaixo do estoque mínimo)
  const produtosCriticos = useMemo(() => {
    return produtos.filter((p) => p.quantidade <= p.quantidadeMinima);
  }, [produtos]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 text-gray-800">
      {/* Cabeçalho */}
      <header className="mb-8 border-b border-[#E8DFC8] pb-4">
        <h1 className="text-3xl font-bold text-[#6B4E3D]">
          Gerenciamento de Estoque
        </h1>
        <p className="text-sm text-gray-600">
          Sistema de Controle de Insumos - Clínica de Estética
        </p>
      </header>

      {/* Alertas de Estoque Baixo */}
      {produtosCriticos.length > 0 && (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <h3 className="text-lg font-semibold text-red-800">
              Atenção: {produtosCriticos.length} produto(s) com estoque crítico!
            </h3>
          </div>
          <ul className="mt-2 list-disc list-inside text-sm text-red-700">
            {produtosCriticos.map((p) => (
              <li key={p.id}>
                <strong>{p.nome}</strong>: Restam apenas{" "}
                <span>
                  {p.quantidade} {p.unidadeMedida}(s)
                </span>{" "}
                (Mínimo recomendado: {p.quantidadeMinima})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid de Operações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Formulário de Movimentação */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-amber-100">
          <h2 className="text-xl font-semibold text-[#6B4E3D] mb-4">
            Registrar Movimentação
          </h2>
          <form onSubmit={handleRegistrarMovimentacao} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insumo / Produto
              </label>
              <select
                value={produtoIdSel}
                onChange={(e) => setProdutoIdSel(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6D58] focus:outline-none"
                required
              >
                <option value="">Selecione o produto...</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (Atual: {p.quantidade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Operação
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="SAIDA"
                    checked={tipoMov === "SAIDA"}
                    onChange={() => setTipoMov("SAIDA")}
                    className="text-[#8C6D58]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Saída (Uso/Atendimento)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="ENTRADA"
                    checked={tipoMov === "ENTRADA"}
                    onChange={() => setTipoMov("ENTRADA")}
                    className="text-[#8C6D58]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Entrada (Compra/Reposição)
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  value={qtdMov}
                  onChange={(e) => setQtdMov(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6D58]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo / Obs.
                </label>
                <input
                  type="text"
                  placeholder="Ex: Limpeza de pele"
                  value={motivoMov}
                  onChange={(e) => setMotivoMov(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6D58]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8C6D58] hover:bg-[#6B4E3D] text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Confirmar Movimentação
            </button>
          </form>
        </div>

        {/* Tabela Principal de Estoque */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-amber-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#6B4E3D]">
              Itens em Estoque
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-lg w-full sm:w-48"
              />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="TODAS">Todas Categorias</option>
                <option value="Dermatológicos">Dermatológicos</option>
                <option value="Descartáveis">Descartáveis</option>
                <option value="Cosméticos">Cosméticos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#FAF6F0] text-[#6B4E3D] uppercase text-xs">
                <tr>
                  <th className="p-3">Produto</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Qtd Atual</th>
                  <th className="p-3">Estoque Mín.</th>
                  <th className="p-3">Preço Unit.</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {produtosFiltrados.map((p) => {
                  const isCritico = p.quantidade <= p.quantidadeMinima;
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/40">
                      <td className="p-3 font-medium text-gray-800">
                        {p.nome}
                      </td>
                      <td className="p-3">{p.categoria}</td>
                      <td className="p-3 font-bold">
                        {p.quantidade} {p.unidadeMedida}
                      </td>
                      <td className="p-3">{p.quantidadeMinima}</td>
                      <td className="p-3">R$ {p.precoUnitario.toFixed(2)}</td>
                      <td className="p-3">
                        {isCritico ? (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                            Repor
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Histórico Recente de Movimentações */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
        <h2 className="text-xl font-semibold text-[#6B4E3D] mb-4">
          Histórico de Movimentações
        </h2>
        {historico.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma movimentação registrada nesta sessão.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#FAF6F0] text-[#6B4E3D] uppercase text-xs">
                <tr>
                  <th className="p-3">Data/Hora</th>
                  <th className="p-3">Produto</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Qtd</th>
                  <th className="p-3">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historico.map((h) => (
                  <tr key={h.id}>
                    <td className="p-3 text-xs">{h.dataHora}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {h.produtoNome}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          h.tipo === "ENTRADA"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {h.tipo}
                      </span>
                    </td>
                    <td className="p-3">{h.quantidade}</td>
                    <td className="p-3 text-xs text-gray-500">{h.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
