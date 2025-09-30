import { FileIcon, UploadCloudIcon, XIcon, AlertCircle, CheckCircle, Image as ImageIcon, Trash2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";

const url = import.meta.env.VITE_BACKEND_URL;

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_FILES = 5; // Maximum 5 files

function BulkImageUpload({
  uploadedImages = [],
  setUploadedImages,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
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

  function handleFileChange(event) {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length === 0) return;

    // Check total file count
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${MAX_FILES} files allowed`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    });

    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ file, error }) => {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${error}`,
          variant: "destructive"
        });
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
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
    const files = Array.from(event.dataTransfer.files || []);
    handleFiles(files);
  }

  function removeFile(index) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  function clearAllFiles() {
    setSelectedFiles([]);
    setUploadedImages([]);
    setUploadProgress({});
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImages() {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append("my_files", file);
      });

      const response = await axios.post(
        `${url}/admin/products/upload-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout for bulk upload
        }
      );

      if (response?.data?.success) {
        const uploadedResults = response.data.results;
        setUploadedImages(uploadedResults);
        setSelectedFiles([]);
        
        toast({
          title: "Upload Successful",
          description: `${uploadedResults.length} images uploaded successfully`,
        });

        // Clear input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } else {
        throw new Error(response?.data?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }

  async function deleteImage(publicId, index) {
    try {
      const response = await axios.delete(`${url}/admin/products/delete-image/${publicId}`);
      
      if (response?.data?.success) {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        toast({
          title: "Image Deleted",
          description: "Image deleted successfully",
        });
      } else {
        throw new Error(response?.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || error.message || "Failed to delete image",
        variant: "destructive"
      });
    }
  }

  return (
    <div className={`w-full ${isCustomStyling ? "" : "max-w-4xl mx-auto"}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Bulk Image Upload</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {selectedFiles.length + uploadedImages.length} / {MAX_FILES} files
            </Badge>
            {(selectedFiles.length > 0 || uploadedImages.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                className="text-destructive hover:text-destructive"
              >
                <Trash2Icon className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
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
          Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB per file
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${dragActive ? "border-primary bg-primary/5" : "border-border"}
          ${uploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
        `}
      >
        <Input
          id="bulk-image-upload"
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        <Label
          htmlFor="bulk-image-upload"
          className={`
            flex flex-col items-center justify-center h-32 cursor-pointer
            ${uploading ? "cursor-not-allowed" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full ${dragActive ? "bg-primary/10" : "bg-muted"}`}>
              <UploadCloudIcon className={`w-8 h-8 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium">
                {uploading ? "Uploading..." : dragActive ? "Drop your images here" : "Drag & drop or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {uploading ? "Please wait..." : dragActive ? "Release to upload" : "Choose multiple image files"}
              </p>
            </div>
          </div>
        </Label>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Selected Files ({selectedFiles.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={uploadImages}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full"
          >
            {uploading ? "Uploading..." : `Upload ${selectedFiles.length} Images`}
          </Button>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Uploaded Images ({uploadedImages.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.thumbnail_url || image.secure_url}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteImage(image.public_id, index)}
                    className="h-8 w-8"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p className="truncate">{image.format?.toUpperCase()} • {image.width}×{image.height}</p>
                  <p className="truncate">{(image.bytes / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkImageUpload;
