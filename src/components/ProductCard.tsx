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
    <Card key={product.id}>
      <CardContent>
        <img
          className="rounded-md object-cover"
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
