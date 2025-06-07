import type { AxiosResponse } from "axios";
import { api } from "../api";

export type GetRecommendedCreditCardsRequest = {
  income: number;
  amountInvested: number;
  expensesPerInvoice: number;
  banks: string[];
  brands: string[];
};

export type CreditCard = {
  id: number,
  nome: string,
  emissor: string,
  bandeira: string,
  anuidadeGratis: boolean,
  rendaMinima: number,
  beneficios: string,
  gastoMedioFaturaIsencao: number,
  investimentoMinimoIsencao: number | null,
  pontosPorDolar: number,
  cashback: number,
  urlImagem: string,
  linkCartao: string,
  observacoes: string,
  faltaInvestirParaIsentar: number | null,
  faltaGastarParaIsentar: number | null
}

export type GetRecommendedCreditCardsResponse = {
  recomendados: CreditCard[];
  sugestoesGastos: CreditCard[];
  sugestoesInvestimentos: CreditCard[];
}

export const getRecommendedCreditCards = async (request: GetRecommendedCreditCardsRequest): Promise<GetRecommendedCreditCardsResponse | null> => {
  const { income, amountInvested, expensesPerInvoice, banks, brands } = request;

  const params = new URLSearchParams({
    rendaMensal: income.toString(),
    investimentoAtual: amountInvested.toString(),
    gastoMedioFatura: expensesPerInvoice.toString()
  });

  banks.forEach((bank) => {
    params.append("bancos", bank);
  });

  brands.forEach((brand) => {
    params.append("bandeiras", brand);
  });

  try {
    const response: AxiosResponse<GetRecommendedCreditCardsResponse> = await api.get(`/cartoes/recomendados?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Erro na requisição:", error);

    return null;
  }
}
