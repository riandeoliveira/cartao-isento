import type { ReactElement } from "react";
import { Link } from "react-router";

export const NotFound = (): ReactElement => {
  return (
    <div className="bg-c-darkest min-h-screen flex justify-center">
      <div className="text-white flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold text-white max-s-480:text-2xl text-center">404 - Página não encontrada</h1>
        <Link to="/" className="underline text-c-light-blue">Voltar para o início</Link>
      </div>
    </div>
  )
}
