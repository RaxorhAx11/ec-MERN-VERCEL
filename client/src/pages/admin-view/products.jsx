import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Package,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    // Validate form before submission
    if (!isFormValid()) {
      toast({
        title: "Form validation failed",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive"
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Product updated successfully",
            });
          } else {
            toast({
              title: "Update failed",
              description: data?.payload?.message || "Failed to update product",
              variant: "destructive"
            });
          }
        }).catch((error) => {
          console.error("Update error:", error);
          toast({
            title: "Update failed",
            description: "An error occurred while updating the product",
            variant: "destructive"
          });
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
            toast({
              title: "Product added successfully",
            });
          } else {
            toast({
              title: "Add failed",
              description: data?.payload?.message || "Failed to add product",
              variant: "destructive"
            });
          }
        }).catch((error) => {
          console.error("Add error:", error);
          toast({
            title: "Add failed",
            description: "An error occurred while adding the product",
            variant: "destructive"
          });
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        toast({
          title: "Failed to delete product",
          description: data?.payload?.message || "Failed to delete product",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error deleting product",
        description: "An error occurred while deleting the product",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  function isFormValid() {
    // Check if all required fields are filled (excluding averageReview and salePrice which are optional)
    const requiredFields = ['title', 'description', 'category', 'brand', 'price', 'totalStock'];
    const allFieldsFilled = requiredFields.every(field => formData[field] && formData[field] !== "");
    
    // Check if image is uploaded
    const imageUploaded = uploadedImageUrl !== "";
    
    return allFieldsFilled && imageUploaded;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter products based on search term
  const filteredProducts = productList?.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate stats
  const totalProducts = productList?.length || 0;
  const lowStockProducts = productList?.filter(p => p.totalStock < 10).length || 0;
  const outOfStockProducts = productList?.filter(p => p.totalStock === 0).length || 0;

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button 
            onClick={() => setOpenCreateProductsDialog(true)}
            className="admin-button primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Total Products</p>
                <p className="admin-stat-value">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Low Stock</p>
                <p className="admin-stat-value">{lowStockProducts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">Out of Stock</p>
                <p className="admin-stat-value">{outOfStockProducts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 admin-input"
                />
              </div>
              <Button variant="outline" className="admin-button outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="admin-button"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="admin-button"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-4"
          }>
            {filteredProducts.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <Card className="admin-card">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No products match your search criteria" : "Get started by adding your first product"}
              </p>
              <Button 
                onClick={() => setOpenCreateProductsDialog(true)}
                className="admin-button primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Product Form Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 py-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
            
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
