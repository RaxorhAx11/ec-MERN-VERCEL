import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-3 text-sm text-muted-foreground">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : ""
              } text-lg font-bold text-foreground`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-primary">
                ₹{product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full" disabled variant="secondary">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;