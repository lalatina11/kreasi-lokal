import { Session } from "@/types";
import { ReactNode } from "react";
import DashboardPageHeader from "../headers/DashboardPageHeader";

interface Props {
  children: ReactNode;
  session: Session;
}

const DashboardPageContainer = ({ children, session }: Props) => {
  return (
    <div>
      <DashboardPageHeader session={session} />
      {children}
    </div>
  );
};

export default DashboardPageContainer;
