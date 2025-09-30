import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("User ID:", user?.id);

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
              className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
            });
          } else {
            toast({
              title: "Failed to update address",
              variant: "destructive",
              className: "bg-[#475569] text-white border-none font-poppins text-sm",
            });
          }
        }).catch((error) => {
          toast({
            title: "Error updating address",
            variant: "destructive",
            className: "bg-[#475569] text-white border-none font-poppins text-sm",
          });
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
              className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
            });
          } else {
            toast({
              title: "Failed to add address",
              variant: "destructive",
              className: "bg-[#475569] text-white border-none font-poppins text-sm",
            });
          }
        }).catch((error) => {
          toast({
            title: "Error adding address",
            variant: "destructive",
            className: "bg-[#475569] text-white border-none font-poppins text-sm",
          });
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
          className: "bg-[#6793AC] text-white border-none font-poppins text-sm",
        });
      } else {
        toast({
          title: "Failed to delete address",
          variant: "destructive",
          className: "bg-[#475569] text-white border-none font-poppins text-sm",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error deleting address",
        variant: "destructive",
        className: "bg-[#475569] text-white border-none font-poppins text-sm",
      });
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    const requiredFields = ['address', 'city', 'pincode', 'phone'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== "");
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card className="bg-white border-[#6793AC]/20 shadow-md rounded-xl font-poppins relative overflow-hidden animate-zoom-in">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.3" className="wave-1" />
          <path d="M0,40 C400,20 800,60 1200,20 C1320,0 1440,40 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.2" className="wave-2" />
        </svg>
      </div>
      <div className="mb-5 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader className="z-20 relative">
        <CardTitle className="text-xl font-bold text-[#114AB1]">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 z-30 relative bg-white">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
          buttonClassName="bg-[#114AB1] hover:bg-[#114AB1]/90 text-white text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#114AB1]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </CardContent>
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

export default Address;