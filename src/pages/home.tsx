import { useState, type ReactElement } from "react";
import { brands } from "../data/brands";
import { banks } from "../data/banks";
import { NumericFormat } from "react-number-format";
import { InfoDialog } from "../components/info-dialog";
import { getRecommendedCreditCards, type GetRecommendedCreditCardsResponse } from "../services/credit-card";
import { cn } from "../utils/cn";
import { toast } from "react-toastify";
import { SuggestedCreditCard } from "../components/suggested-credit-card";
import { toBrazilianNumber } from "../utils/numeric";
import { RecommendedCreditCard } from "../components/recommended-credit-card";
import { ContactModal } from "../components/contact-modal";

type SearchForm = {
  income?: number;
  amountInvested?: number;
  expensesPerInvoice?: number;
  banks: string[];
  brands: string[];
};

export const Home = (): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);
  const [maxPointsPerDollar, setMaxPointsPerDollar] = useState<number | null>(null);
  const [maxCashback, setMaxCashback] = useState<number | null>(null);

  const [searchForm, setSearchForm] = useState<SearchForm>({
    income: undefined,
    amountInvested: undefined,
    expensesPerInvoice: undefined,
    banks: banks.map((item) => item.value),
    brands: brands.map((item) => item.value)
  })

  const [recommendedCreditCards, setRecommendedCreditCards] = useState<GetRecommendedCreditCardsResponse>({
    recomendados: [],
    sugestoesGastos: [],
    sugestoesInvestimentos: []
  });

  const handleGetRecommendedCreditCards = async (): Promise<void> => {
    const { income, amountInvested, expensesPerInvoice, banks, brands } = searchForm;

    const isFormInvalid = (
      income == null ||
      amountInvested == null ||
      expensesPerInvoice == null
    );

    if (isFormInvalid) {
      toast.error("Por favor, preencha os campos em branco.");

      return;
    }

    if (banks.length === 0 || brands.length === 0) {
      toast.error("Por favor, selecione pelo menos um banco e uma bandeira de cartão.");

      return;
    }

    setIsLoading(true);

    const response = await getRecommendedCreditCards({
      amountInvested,
      expensesPerInvoice,
      income,
      banks,
      brands
    });

    if (!response) {
      toast.error("Ocorreu um erro desconhecido! Por favor, tente novamente mais tarde ou entre em contato conosco.");

      setIsLoading(false);

      return;
    }

    const { recomendados, sugestoesInvestimentos, sugestoesGastos } = response;

    const points = recomendados.map((item) => item.pontosPorDolar);
    const cashbacks = recomendados.map((item) => item.cashback);

    setRecommendedCreditCards({
      recomendados,
      sugestoesGastos,
      sugestoesInvestimentos
    })

    setMaxPointsPerDollar(Math.max(...points));
    setMaxCashback(Math.max(...cashbacks));

    setIsLoading(false);
    setIsFirstRequest(false);
  }

  const handleSelectBank = (bank: string): void => {
    if (searchForm.banks.includes(bank)) {
      const banks = searchForm.banks.filter((bankItem) => bankItem !== bank);

      setSearchForm({ ...searchForm, banks });

      return;
    }

    setSearchForm({
      ...searchForm,
      banks: [...searchForm.banks, bank]
    });
  }

  const handleSelectBrand = (brand: string): void => {
    if (searchForm.brands.includes(brand)) {
      const brands = searchForm.brands.filter((brandItem) => brandItem !== brand);

      setSearchForm({ ...searchForm, brands });

      return;
    }

    setSearchForm({
      ...searchForm,
      brands: [...searchForm.brands, brand]
    });
  }

  return (
    <>
      <div className="bg-c-darkest min-h-screen flex justify-center">
        <div className="w-5xl my-10 mx-4">
          <h1 className="font-bold text-white text-4xl text-center mb-6 max-s-840:text-2xl max-s-600:text-xl max-s-600:mb-4">
            Encontre os melhores cartões de crédito sem anuidade para o seu perfil
          </h1>
          <p className="text-2xl text-c-light-gray text-center mb-14 max-s-840:text-xl max-s-600:text-base max-s-600:mb-6">Informe sua renda mensal, quanto você possui
            investido, seus
            gastos mensais e, se quiser,
            filtre por banco ou
            bandeira do cartão.</p>
          <div className="flex gap-16 max-s-840:flex-col">
            <form className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-4">
                <label htmlFor="income" className="text-white font-bold text-2xl max-s-840:text-xl">Renda:</label>
                <NumericFormat
                  id="income"
                  value={searchForm.income}
                  onValueChange={({ floatValue }) => setSearchForm({ ...searchForm, income: floatValue })}
                  placeholder="R$ 5.000,00"
                  prefix="R$ "
                  thousandSeparator="."
                  decimalScale={2}
                  max={999999}
                  allowNegative={false}
                  decimalSeparator=","
                  fixedDecimalScale
                  className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="amount-invested" className="text-white font-bold text-2xl max-s-840:text-xl">Quantia investida:</label>
                <NumericFormat
                  id="amount-invested"
                  value={searchForm.amountInvested}
                  onValueChange={({ floatValue }) => setSearchForm({ ...searchForm, amountInvested: floatValue })}
                  placeholder="R$ 50.000,00"
                  prefix="R$ "
                  thousandSeparator="."
                  decimalScale={2}
                  max={999999}
                  allowNegative={false}
                  decimalSeparator=","
                  fixedDecimalScale
                  className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="expenses-per-invoice" className="text-white font-bold text-2xl max-s-840:text-xl">Gastos por fatura:</label>
                <NumericFormat
                  id="expenses-per-invoice"
                  value={searchForm.expensesPerInvoice}
                  onValueChange={({ floatValue }) => setSearchForm({ ...searchForm, expensesPerInvoice: floatValue })}
                  placeholder="R$ 3.000,00"
                  prefix="R$ "
                  thousandSeparator="."
                  decimalScale={2}
                  max={999999}
                  allowNegative={false}
                  decimalSeparator=","
                  fixedDecimalScale
                  className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                />
              </div>
            </form>
            <div className="flex flex-col flex-2 gap-5">
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold text-2xl max-s-840:text-xl">Filtrar por bancos:</span>
                <div className="flex gap-2 flex-wrap max-s-840:justify-center">
                  {banks.map(({ icon: Icon, title, value }) => (
                    <button
                      type="button"
                      title={title}
                      data-tooltip-id={value}
                      onClick={() => handleSelectBank(value)}
                      className={cn("cursor-pointer hover:scale-90 transition-transform", searchForm.banks.includes(value) ? "opacity-100" : "opacity-10")}
                      key={value}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white font-bold text-2xl max-s-840:text-xl">Filtrar por bandeira:</span>
                <div className="flex gap-2 flex-wrap max-s-840:justify-center">
                  {brands.map(({ icon: Icon, title, value }) => (
                    <button
                      type="button"
                      title={title}
                      onClick={() => handleSelectBrand(value)}
                      className={cn("cursor-pointer hover:scale-90 transition-transform", searchForm.brands.includes(value) ? "opacity-100" : "opacity-10")}
                      key={value}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex my-14 justify-center">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGetRecommendedCreditCards}
              className="bg-linear-to-r from-c-light-blue to-c-dark-blue px-8 py-3 rounded-4xl cursor-pointer text-white font-bold hover:scale-90 transition-transform disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Buscando..." : "Encontrar"}
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {
              isLoading ? (
                <>
                  <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse mt-20" />
                  <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                  <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                </>
              ) : (
                <>
                  {
                    recommendedCreditCards.recomendados.length > 0 ? (
                      <>
                        {
                          maxPointsPerDollar ? (
                            <p className="text-3xl text-c-light-gray text-center mb-4 max-s-840:text-2xl max-s-600:text-xl">Você pode conseguir cartões de até {toBrazilianNumber(maxPointsPerDollar)} {maxPointsPerDollar === 1 ? "ponto" : "pontos"} por dólar</p>
                          ) : maxCashback && (
                            <p className="text-3xl text-c-light-gray text-center mb-4 max-s-840:text-2xl max-s-600:text-xl">Você pode conseguir cartões de até {toBrazilianNumber(maxCashback)}% de cashback</p>
                          )
                        }
                        {
                          recommendedCreditCards.recomendados.map((data) => (
                            <RecommendedCreditCard {...data} key={data.id} />
                          ))
                        }
                      </>
                    ) : !isFirstRequest && (
                      <span className="text-c-light-gray text-xl text-center">Nenhum cartão encontrado com os filtros selecionados :(</span>
                    )
                  }
                </>
              )
            }
          </div>

          {
            (isLoading || (recommendedCreditCards.sugestoesInvestimentos.length > 0 && recommendedCreditCards.sugestoesGastos.length > 0)) && (
              <div className="mt-14 flex flex-col gap-12">
                <p className="text-3xl text-c-light-gray text-center max-s-840:text-2xl max-s-600:text-xl">Aqui estão os cartões que você está próximo de isentar:</p>
                <div className="flex gap-10 max-s-600:flex-col">
                  <div className="flex flex-col flex-1 gap-8">
                    <span className="text-center text-white text-3xl max-s-840:text-2xl max-s-600:text-xl">Por investimentos:</span>
                    <div className="flex flex-col gap-7">
                      {
                        isLoading ? (
                          <>
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                          </>
                        ) : (
                          <>
                            {
                              recommendedCreditCards.sugestoesInvestimentos.map((data) => (
                                <SuggestedCreditCard type="investment" {...data} key={data.id} />
                              ))
                            }
                          </>
                        )
                      }
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-8">
                    <span className="text-center text-white text-3xl max-s-840:text-2xl max-s-600:text-xl">Por gastos na fatura:</span>
                    <div className="flex flex-col gap-7">
                      {
                        isLoading ? (
                          <>
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                            <div className="bg-c-medium-gray/10 rounded-lg h-40 animate-pulse" />
                          </>
                        ) : (
                          <>
                            {
                              recommendedCreditCards.sugestoesGastos.map((data) => (
                                <SuggestedCreditCard type="spent" {...data} key={data.id} />
                              ))
                            }
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <InfoDialog />
      <ContactModal />
    </>
  )
}
