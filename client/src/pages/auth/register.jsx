import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, User, Mail, Lock, ArrowRight, CheckCircle, X } from "lucide-react";

function AuthRegister() {
  const [formData, setFormData] = useState({
  userName: "",
  email: "",
  password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(registerUser({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      }));
      
      if (result.payload?.success) {
        toast({
          title: result.payload.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: result.payload?.message || "Registration failed",
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

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className={`w-full transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 text-sm">Join WalkUp and start shopping</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              placeholder="Choose a username"
              value={formData.userName}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('userName')}
              onBlur={() => setFocusedField(null)}
              className={`h-11 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                focusedField === 'userName' ? 'border-gray-400' : 'border-gray-200'
              }`}
              required
              disabled={isLoading || authLoading}
              minLength={3}
            />
          </div>
          
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handlePasswordChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`h-11 pr-10 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                  focusedField === 'password' ? 'border-gray-400' : 'border-gray-200'
                }`}
                required
                disabled={isLoading || authLoading}
                minLength={6}
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
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-500' : 
                    passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`h-11 pr-10 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                  focusedField === 'confirmPassword' ? 'border-gray-400' : 'border-gray-200'
                }`}
                required
                disabled={isLoading || authLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isLoading || authLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className={`text-xs ${
                formData.password === formData.confirmPassword 
                  ? 'text-green-600' 
                  : 'text-red-500'
              }`}>
                {formData.password === formData.confirmPassword ? (
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
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;