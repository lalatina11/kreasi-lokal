import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const router = useRouter();
  const handleBack = () => {
    router.history.back();
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Oops!</CardTitle>
          <CardDescription>
            The page you are looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full grid grid-cols-2 gap-2">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft /> Go Back
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
