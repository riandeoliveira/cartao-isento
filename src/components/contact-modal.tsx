import { useState, type MouseEvent, type ReactElement } from 'react';
import { useModalStore } from '../stores/modal-store';
import { Icon } from '../assets';
import { sendEmailContact, type EmailContact } from '../services/email-contact';
import { toast } from 'react-toastify';
import { EMAIL_REGEX } from '../constants';

export const ContactModal = (): ReactElement => {
  const modalStore = useModalStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);

  const [contactForm, setContactForm] = useState<EmailContact>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleModalOpen = (): void => modalStore.open("contactModal");
  const handleModalClose = (): void => modalStore.close("contactModal");

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleModalClose();
    }
  };

  const handleEmailContactSubmit = async (): Promise<void> => {
    const { name, email, subject, message } = contactForm;

    if (!name || !email || !subject || !message) {
      toast.error("Por favor, preencha os campos em branco.");

      return;
    }

    if (name.length < 2 || name.length > 50) {
      toast.error("O nome deve ter entre 2 e 50 caracteres.");

      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.error("O e-mail deve ser válido.");

      return;
    }

    if (subject.length < 5 || subject.length > 100) {
      toast.error("O assunto deve ter entre 5 e 100 caracteres.");

      return;
    }

    if (message.length < 10 || message.length > 1000) {
      toast.error("A mensagem deve ter entre 10 e 1000 caracteres.");

      return;
    }

    setIsLoading(true);

    const { mensagem } = await sendEmailContact({
      name,
      email,
      subject,
      message
    });

    if (mensagem === "Mensagem enviada com sucesso!") {
      toast.success(mensagem);

      handleModalClose();

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } else {
      toast.error(mensagem);
    }

    setIsLoading(false);
  }

  return (
    <>
      {
        isButtonVisible && (
          <div className="-rotate-90 flex gap-2 items-center fixed -right-13 top-1/2 -translate-y-1/2">
            <button
              type="button"
              title="Entre em contato"
              className="cursor-pointer rounded-t-2xl bg-linear-to-r from-c-light-blue to-c-dark-blue text-white px-4 py-2 hover:scale-90 transition-transform tracking-wide"
              onClick={handleModalOpen}
            >
              Contato
            </button>
            <button
              type="button"
              title="Fechar"
              onClick={() => setIsButtonVisible(false)}
              className="cursor-pointer flex items-center justify-center w-8 h-8"
            >
              <Icon.Close />
            </button>
          </div>
        )
      }
      {
        modalStore.contactModal.isOpen && (
          <div onClick={handleOverlayClick} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-c-darker p-6 rounded-lg w-lg mx-4 overflow-y-auto">
              <div className="flex justify-between mb-6">
                <p className="text-white text-2xl font-bold">
                  Entre em Contato
                </p>
                <button type="button" title="Fechar" onClick={handleModalClose} className="cursor-pointer">
                  <Icon.Close />
                </button>
              </div>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-white font-bold">Nome:</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="João Silva"
                    value={contactForm.name}
                    onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                    className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-white font-bold">E-mail:</label>
                  <input
                    type="text"
                    id="email"
                    placeholder="teste@email.com"
                    value={contactForm.email}
                    onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                    className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-white font-bold">Assunto:</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Meu assunto"
                    value={contactForm.subject}
                    onChange={(event) => setContactForm({ ...contactForm, subject: event.target.value })}
                    className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-white font-bold">Mensagem:</label>
                  <textarea
                    id="message"
                    placeholder="Minha mensagem"
                    rows={4}
                    value={contactForm.message}
                    onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
                    className="bg-white px-3 py-2 rounded-lg border-2 border-c-light-gray resize-none"
                  />
                </div>
              </form>
              <button
                type="button"
                onClick={handleEmailContactSubmit}
                disabled={isLoading}
                className="bg-linear-to-r from-c-light-blue to-c-dark-blue px-8 py-3 rounded-lg cursor-pointer text-white font-bold hover:scale-95 transition-transform mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};
