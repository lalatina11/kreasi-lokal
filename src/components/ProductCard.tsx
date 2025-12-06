import {
  getAllProducts,
  getNoProductImageLink,
} from "@/server/renders/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "@tanstack/react-router";

interface Props {
  products: Awaited<ReturnType<typeof getAllProducts>>;
}

const ProductCard = ({ products }: Props) => {
  return products.map((product) => (
    <Card
      key={product.id}
      className="hover:scale-105 transition-all duration-300"
    >
      <CardContent>
        <img
          className="rounded-md object-cover aspect-square ease-in-out"
          src={product.image || getNoProductImageLink()}
          alt=""
        />
      </CardContent>
      <CardHeader className="w-full self-start flex">
        <Link to={`/products` + `/${product.id}`}>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="">
            {product.shortDescription}
          </CardDescription>
        </Link>
      </CardHeader>
    </Card>
  ));
};

export default ProductCard;
