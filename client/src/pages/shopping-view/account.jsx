import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-poppins">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
          alt="Account Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#6793AC]/30"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#114AB1] mb-2">My Account</h1>
            <p className="text-gray-600">Manage your orders and addresses</p>
          </div>
          
          <div className="flex flex-col rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-[#6793AC]/20 animate-fade-in">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-lg bg-[#6793AC]/10 p-1 mb-6">
                <TabsTrigger
                  value="orders"
                  className="rounded-md text-[#114AB1] font-medium data-[state=active]:bg-white data-[state=active]:text-[#475569] data-[state=active]:shadow-sm transition-all duration-200 py-2"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Orders
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="rounded-md text-[#114AB1] font-medium data-[state=active]:bg-white data-[state=active]:text-[#475569] data-[state=active]:shadow-sm transition-all duration-200 py-2"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Addresses
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="mt-0">
                <ShoppingOrders />
              </TabsContent>
              
              <TabsContent value="address" className="mt-0">
                <Address />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;