import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer bg-white border-[#6793AC]/20 shadow-md rounded-lg font-poppins relative overflow-hidden animate-slide-in-up ${
        selectedId?._id === addressInfo?._id
          ? "border-[#475569] border-[2px]"
          : ""
      }`}
    >
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.3" className="wave-1" />
          <path d="M0,40 C400,20 800,60 1200,20 C1320,0 1440,40 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.2" className="wave-2" />
        </svg>
      </div>
      <CardContent className="grid p-4 gap-2 z-10">
        <Label className="text-sm text-[#114AB1] wave-effect">Address: {addressInfo?.address}</Label>
        <Label className="text-sm text-[#114AB1] wave-effect">City: {addressInfo?.city}</Label>
        <Label className="text-sm text-[#114AB1] wave-effect">Pincode: {addressInfo?.pincode}</Label>
        <Label className="text-sm text-[#114AB1] wave-effect">Phone: {addressInfo?.phone}</Label>
        <Label className="text-sm text-[#114AB1] wave-effect">Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between z-10">
        <Button
          onClick={() => handleEditAddress(addressInfo)}
          className="bg-[#475569] hover:bg-[#475569]/90 text-white text-xs rounded-lg transition-all duration-300 hover:scale-105"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDeleteAddress(addressInfo)}
          className="bg-[#475569] hover:bg-[#475569]/90 text-white text-xs rounded-lg transition-all duration-300 hover:scale-105"
        >
          Delete
        </Button>
      </CardFooter>
      <style>{`
        .wave-1 { animation: wave1 6s ease-in-out infinite; }
        .wave-2 { animation: wave2 8s ease-in-out infinite; }
        @keyframes wave1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-100px); }
        }
        @keyframes wave2 {
          0%, 100% { transform: translateX(-50px); }
          50% { transform: translateX(50px); }
        }
        .wave-effect {
          animation: ripple 6s ease-in-out infinite;
        }
        @keyframes ripple {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </Card>
  );
}

export default AddressCard;