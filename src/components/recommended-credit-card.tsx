import type { ReactElement } from "react";
import type { CreditCard } from "../services/credit-card";
import { toBrazilianNumber } from "../utils/numeric";

type RecommendedCreditCardProps = CreditCard;

export const RecommendedCreditCard = ({ urlImagem, nome, observacoes, pontosPorDolar, cashback, linkCartao }: RecommendedCreditCardProps): ReactElement => {
  const pointsPerDollarText = `${toBrazilianNumber(pontosPorDolar)} ${pontosPorDolar === 1 ? "pt/$" : "pts/$"}`;
  const cashbackText = `${toBrazilianNumber(cashback)}% de cashback`;

  return (
    <a href={linkCartao} target="_blank" rel="noopener noreferrer" title="Ir para o cartão" className="cursor-pointer hover:scale-105 transition-transform">
      <div className="bg-white px-4 py-5 rounded-2xl flex gap-4 max-s-720:items-center max-s-720:flex-col">
        <img src={urlImagem} alt={nome} className="w-52" />
        <div className=" flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2 max-s-600:flex-col">
            <strong className="text-2xl max-s-800:text-xl max-s-600:text-center">{nome}</strong>
            <span className="font-bold text-lg min-w-fit">
              {pontosPorDolar > 0 ? pointsPerDollarText : cashbackText}
            </span>
          </div>
          <p className="text-justify">{observacoes}</p>
        </div>
      </div>
    </a>
  )
}
