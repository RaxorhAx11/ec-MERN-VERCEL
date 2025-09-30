import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white border-[#6793AC]/20 shadow-md rounded-lg font-poppins relative overflow-hidden animate-zoom-in">
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.3" className="wave-1" />
          <path d="M0,40 C400,20 800,60 1200,20 C1320,0 1440,40 1440,40 L1440,40 L0,40 Z" fill="#FFFFFF" fillOpacity="0.2" className="wave-2" />
        </svg>
      </div>
      <div className="p-4 border-b border-[#6793AC]/20 z-10">
        <h2 className="text-xl font-bold text-[#114AB1] wave-effect">Filters</h2>
      </div>
      <div className="p-4 space-y-4 z-10">
        {Object.keys(filterOptions).map((keyItem, idx) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold text-[#114AB1] wave-effect" style={{ animationDelay: `${idx * 0.2}s` }}>{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-[#6793AC]/30 data-[state=checked]:bg-[#114AB1] data-[state=checked]:border-[#114AB1]"
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-[#6793AC]/20" />
          </Fragment>
        ))}
      </div>
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
    </div>
  );
}

export default ProductFilter;