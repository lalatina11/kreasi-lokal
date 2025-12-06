import { ReactNode } from "react";
import AuthPageHeader from "../headers/AuthPageHeader";

interface Props {
  children: ReactNode;
}

const AuthPageContainer = ({ children }: Props) => {
  return (
    <div>
      <AuthPageHeader />
      {children}
    </div>
  );
};

export default AuthPageContainer;
