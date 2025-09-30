import { FileIcon, UploadCloudIcon, XIcon, AlertCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";

const url = import.meta.env.VITE_BACKEND_URL;

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  // Validate file format and size
  function validateFile(file) {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `Unsupported file format. Please use: ${SUPPORTED_FORMATS.map(f => f.split('/')[1]).join(', ')}`
      };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }
    
    return { valid: true };
  }

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (validation.valid) {
        setImageFile(selectedFile);
        setUploadError(null);
      } else {
        setUploadError(validation.error);
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (validation.valid) {
        setImageFile(droppedFile);
        setUploadError(null);
      } else {
        setUploadError(validation.error);
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
      }
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    setUploadError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;
    
    setImageLoadingState(true);
    setUploadError(null);
    
    try {
      const data = new FormData();
      data.append("my_file", imageFile);
      
      const response = await axios.post(
        `${url}/admin/products/upload-image`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
        toast({
          title: "Upload Successful",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error(response?.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setImageLoadingState(false);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";
      setUploadError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }

  useEffect(() => {
    if (imageFile !== null && !uploadedImageUrl) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <div className="space-y-3">
        <Label className="text-lg font-semibold block">Upload Image</Label>
        
        {/* Supported formats info */}
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">Supported formats:</span>
          {SUPPORTED_FORMATS.map((format, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {format.split('/')[1].toUpperCase()}
            </Badge>
          ))}
        </div>
        
        {/* File size limit */}
        <p className="text-xs text-muted-foreground">
          Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${dragActive ? "border-primary bg-primary/5" : "border-border"}
          ${isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
          ${uploadError ? "border-destructive bg-destructive/5" : ""}
        `}
      >
        <Input
          id="image-upload"
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`
              flex flex-col items-center justify-center h-32 cursor-pointer
              ${isEditMode ? "cursor-not-allowed" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${dragActive ? "bg-primary/10" : "bg-muted"}`}>
                <UploadCloudIcon className={`w-8 h-8 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {dragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {dragActive ? "Release to upload" : "Choose an image file"}
                </p>
              </div>
            </div>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Uploading...</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Please wait while we upload your image</p>
          </div>
        ) : uploadedImageUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Upload successful!</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">{imageFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{imageFile.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          </div>
        )}

        {/* Error display */}
        {uploadError && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-destructive mt-1">{uploadError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
