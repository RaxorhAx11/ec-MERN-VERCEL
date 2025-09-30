import { Outlet } from "react-router-dom";
import { ShoppingBag, Shield, Star, Users } from "lucide-react";

function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding and features */}
        <div className="hidden lg:flex items-center justify-center bg-gray-900 w-1/2 px-16 relative">
          <div className="max-w-lg space-y-12 text-white">
            <div className="space-y-6">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div className="text-center space-y-3">
                <h1 className="text-5xl font-light tracking-tight text-white">
                  Welcome to
                  <span className="block font-medium text-gray-100 mt-2">
                    WalkUp
                  </span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                  Your premium destination for fashion and lifestyle products
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white mb-1">Secure Shopping</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Your data and payments are always protected</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white mb-1">Premium Quality</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Curated selection of top-quality products</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white mb-1">Community Driven</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Join thousands of satisfied customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth forms */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;