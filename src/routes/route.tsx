import type { ReactElement } from "react";
import { ToastContainer } from "react-toastify";

type RouteProps = {
  page: () => ReactElement;
};

export const Route = ({ page: Page }: RouteProps): ReactElement => {
  return (
    <>
      <ToastContainer
        theme="dark"
        toastClassName="!bg-c-darker !font-poppins !text-zinc-400"
      />
      <Page />
    </>
  );
};
