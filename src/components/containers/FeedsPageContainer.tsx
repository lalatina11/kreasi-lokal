import { Session } from "@/types";
import { ReactNode } from "react";
import FeedsPageHeader from "../headers/FeedsPageHeader";

interface Props {
  children: ReactNode;
  session: Session;
}

const FeedsPageContainer = ({ children, session }: Props) => {
  return (
    <div>
      <FeedsPageHeader session={session} />
      {children}
    </div>
  );
};

export default FeedsPageContainer;
