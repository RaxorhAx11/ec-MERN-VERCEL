import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, Eye, Star } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  viewMode = "grid"
}) {
  const hasSale = product?.salePrice > 0;
  const discountPercentage = hasSale 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="admin-card group hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4 p-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {hasSale && (
              <Badge className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product?.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {product?.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product?.brand}
              </Badge>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product?.averageReview || 0)
                        ? "text-warning fill-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                ({product?.averageReview?.toFixed(1) || 0})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasSale ? (
                  <>
                    <span className="text-lg font-bold text-primary">
                      ₹{product?.salePrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-foreground">
                    ₹{product?.price}
                  </span>
                )}
              </div>
              <Badge 
                className={`text-xs ${
                  product?.totalStock > 10 
                    ? "bg-success text-success-foreground" 
                    : product?.totalStock > 0 
                    ? "bg-warning text-warning-foreground"
                    : "bg-error text-error-foreground"
                }`}
              >
                {product?.totalStock > 0 ? `${product?.totalStock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
              variant="outline"
              size="sm"
              className="admin-button outline"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDelete(product?._id)}
              className="admin-button destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="admin-card group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Sale Badge */}
          {hasSale && (
            <Badge className="absolute top-3 left-3 bg-error text-error-foreground">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Stock Status */}
          <Badge 
            className={`absolute top-3 right-3 ${
              product?.totalStock > 10 
                ? "bg-success text-success-foreground" 
                : product?.totalStock > 0 
                ? "bg-warning text-warning-foreground"
                : "bg-error text-error-foreground"
            }`}
          >
            {product?.totalStock > 0 ? `${product?.totalStock} in stock` : "Out of stock"}
          </Badge>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="admin-button secondary"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
              className="admin-button primary"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product?.title}
          </h3>
          
          {/* Category & Brand */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {product?.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product?.brand}
            </Badge>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product?.averageReview || 0)
                      ? "text-warning fill-warning"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-1">
              ({product?.averageReview?.toFixed(1) || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasSale ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ₹{product?.salePrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product?.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-foreground">
                  ₹{product?.price}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            variant="outline"
            className="flex-1 admin-button outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleDelete(product?._id)}
            className="admin-button destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
