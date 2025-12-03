import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  isPrimary?: boolean;
}

const BackButton = ({ isPrimary }: Props) => {
  const router = useRouter();
  return (
    <Button
      className="w-fit self-start"
      onClick={() => router.history.back()}
      variant={isPrimary ? "default" : "outline"}
    >
      <ArrowLeft />
      Back
    </Button>
  );
};

export default BackButton;
