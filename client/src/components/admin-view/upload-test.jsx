import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import ProductImageUpload from "./image-upload";

function UploadTest() {
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [testResults, setTestResults] = useState([]);

  const testCases = [
    {
      name: "Valid JPEG Image",
      file: null, // Will be created dynamically
      expected: "success"
    },
    {
      name: "Valid PNG Image", 
      file: null,
      expected: "success"
    },
    {
      name: "Large File (>5MB)",
      file: null,
      expected: "error"
    },
    {
      name: "Invalid Format (TXT)",
      file: null,
      expected: "error"
    }
  ];

  const runTests = async () => {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Simulate test case
        results.push({
          name: testCase.name,
          status: "pending",
          message: "Test not implemented yet"
        });
      } catch (error) {
        results.push({
          name: testCase.name,
          status: "error",
          message: error.message
        });
      }
    }
    
    setTestResults(results);
  };

  const clearTest = () => {
    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoadingState(false);
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Image Upload Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Upload Component</h3>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                imageLoadingState={imageLoadingState}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                isEditMode={false}
                isCustomStyling={true}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Test Controls</h3>
              <div className="flex gap-2">
                <Button onClick={runTests} variant="outline">
                  Run Tests
                </Button>
                <Button onClick={clearTest} variant="destructive">
                  Clear
                </Button>
              </div>
              
              {uploadedImageUrl && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Image:</h4>
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <p className="text-sm text-muted-foreground break-all">
                    {uploadedImageUrl}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    {result.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {result.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {result.status === "pending" && <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" />}
                    <span className="font-medium">{result.name}</span>
                    <Badge variant={result.status === "success" ? "default" : result.status === "error" ? "destructive" : "secondary"}>
                      {result.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadTest;
