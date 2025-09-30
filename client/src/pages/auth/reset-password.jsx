import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, CheckCircle, Loader2, Eye, EyeOff, Shield } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast({
        title: "Invalid reset link",
        variant: "destructive",
      });
      navigate("/auth/forgot-password");
      return;
    }
    setToken(tokenParam);
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(resetPassword({ token, newPassword }));
      
      if (result.payload?.success) {
        setIsSuccess(true);
        toast({
          title: result.payload.message,
        });
      } else {
        toast({
          title: result.payload?.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`w-full transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Password reset successful!</h1>
            <p className="text-gray-500 text-sm">You can now login with your new password</p>
          </div>
          
          <Button asChild className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200">
            <Link to="/auth/login">
              Continue to login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-500 text-sm">Enter your new password below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField(null)}
                className={`h-11 pr-10 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                  focusedField === 'newPassword' ? 'border-gray-400' : 'border-gray-200'
                }`}
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`h-11 pr-10 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                  focusedField === 'confirmPassword' ? 'border-gray-400' : 'border-gray-200'
                }`}
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <div className={`text-xs ${
                newPassword === confirmPassword 
                  ? 'text-green-600' 
                  : 'text-red-500'
              }`}>
                {newPassword === confirmPassword ? (
                  'Passwords match'
                ) : (
                  'Passwords do not match'
                )}
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <Button asChild variant="ghost" className="h-11 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Link to="/auth/login">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
