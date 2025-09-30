import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

function AuthLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(loginUser(formData));
      
      if (result.payload?.success) {
        toast({
          title: result.payload.message,
        });
      } else {
        toast({
          title: result.payload?.message || "Login failed",
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`w-full transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`h-11 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                focusedField === 'email' ? 'border-gray-400' : 'border-gray-200'
              }`}
              required
              disabled={isLoading || authLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`h-11 pr-10 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                  focusedField === 'password' ? 'border-gray-400' : 'border-gray-200'
                }`}
                required
                disabled={isLoading || authLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading || authLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;