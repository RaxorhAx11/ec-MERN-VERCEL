import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { forgotPassword } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Loader2, CheckCircle, Send } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(forgotPassword(email));
      
      if (result.payload?.success) {
        setEmailSent(true);
        toast({
          title: result.payload.message,
        });
      } else {
        toast({
          title: result.payload?.message || "Failed to send reset email",
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

  if (emailSent) {
    return (
      <div className={`w-full transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm">
              We've sent password reset instructions to <strong className="text-gray-700">{email}</strong>
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full h-11 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Try different email
              </Button>
              <Button asChild variant="ghost" className="w-full h-11 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Link to="/auth/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </Button>
            </div>
          </div>
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
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Forgot password?</h1>
          <p className="text-gray-500 text-sm">Enter your email and we'll send reset instructions</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`h-11 border transition-colors duration-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 rounded-lg ${
                focusedField === 'email' ? 'border-gray-400' : 'border-gray-200'
              }`}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset instructions'
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

export default ForgotPassword;
