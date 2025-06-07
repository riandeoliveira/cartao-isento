import { useState, type ReactElement } from "react";
import { Icon } from "../assets";

export const InfoDialog = (): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (!isOpen) return <></>;

  return (
    <div className="bg-c-darker p-4 fixed bottom-5 left-5 right-5 rounded-md flex gap-4">
      <p className="text-c-light-gray text-justify max-s-600:text-sm">As informações apresentadas neste site são de caráter informativo e podem não refletir as condições mais atualizadas, pois as instituições financeiras podem alterar benefícios, taxas e requisitos sem aviso prévio.
        Além disso, nem todos os bancos divulgam publicamente a renda mínima necessária para obtenção de determinados cartões. Reforçamos que este site não realiza análise de crédito nem garante a aprovação, e não deve ser considerado como orientação financeira definitiva. Antes de solicitar qualquer cartão, consulte sempre as informações oficiais diretamente com a instituição responsável.</p>
      <div>
        <button type="button" title="Fechar" onClick={() => setIsOpen(false)} className="text-c-light-gray cursor-pointer">
          <Icon.Close />
        </button>
      </div>
    </div>
  )
}
