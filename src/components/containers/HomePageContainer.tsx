import { ReactNode } from "react";
import HomePageHeader from "../headers/HomePageHeader";

interface Props {
  children: ReactNode;
}

const HomePageContainer = ({ children }: Props) => {
  return (
    <div>
      <HomePageHeader />
      {children}
    </div>
  );
};

export default HomePageContainer;
