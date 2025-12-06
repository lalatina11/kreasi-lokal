import { Session } from "@/types";
import { ReactNode } from "react";
import CartPageHeader from "../headers/CartPageHeader";

interface Props {
  children: ReactNode;
  session: Session;
}
const CartPageContainer = ({ children, session }: Props) => {
  return (
    <div>
      <CartPageHeader session={session} />
      {children}
    </div>
  );
};

export default CartPageContainer;
