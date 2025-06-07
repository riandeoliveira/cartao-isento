import type { ReactElement } from "react";
import type { CreditCard } from "../services/credit-card";
import { toBrazilianNumber, toBRL } from "../utils/numeric";

type SuggestedCreditCardProps = CreditCard & {
  type: "investment" | "spent"
}

export const SuggestedCreditCard = ({ linkCartao, urlImagem, nome, faltaInvestirParaIsentar, faltaGastarParaIsentar, pontosPorDolar, type }: SuggestedCreditCardProps): ReactElement => {
  return (
    <a href={linkCartao} target="_blank" rel="noopener noreferrer" title="Ir para o cartão" className="cursor-pointer hover:scale-105 transition-transform">
      <div className="bg-white px-4 py-5 rounded-2xl text-center flex flex-col">
        <img src={urlImagem} alt={nome} className="w-52 m-auto mb-4" />
        <strong>{nome}</strong>
        {type === "investment" && <p>Faltam {toBRL(faltaInvestirParaIsentar!)} investidos</p>}
        {type === "spent" && <p>Faltam {toBRL(faltaGastarParaIsentar!)} gastos</p>}
        <span className="font-bold">{toBrazilianNumber(pontosPorDolar)} {pontosPorDolar === 1 ? "ponto" : "pontos"} por dólar</span>
      </div>
    </a>
  )
}
