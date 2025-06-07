import type { AxiosError, AxiosResponse } from "axios";
import { api } from "../api";

export type EmailContact = {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SendEmailContactRequest = EmailContact

export type SendEmailContactResponse = {
  mensagem: string;
}

export const sendEmailContact = async (request: SendEmailContactRequest): Promise<SendEmailContactResponse> => {
  const { name, email, subject, message } = request;

  const body = {
    nome: name.trim(),
    email: email.trim(),
    assunto: subject.trim(),
    mensagem: message.trim()
  }

  try {
    const response: AxiosResponse<SendEmailContactResponse> = await api.post("/email", body);

    return response.data;
  } catch (error: unknown) {
    console.error("Erro na requisição:", error);

    const { response } = error as AxiosError<SendEmailContactResponse>;

    if (response) {
      return response.data;
    }

    return {
      mensagem: "Ocorreu um erro desconhecido! Por favor, tente novamente mais tarde."
    }
  }
}
