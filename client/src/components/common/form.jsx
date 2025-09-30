import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  buttonClassName,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6793AC] focus:border-transparent"
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6793AC] focus:border-transparent min-h-[80px] resize-vertical"
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6793AC] focus:border-transparent"
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit} className="relative z-30">
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5 relative z-30" key={controlItem.name}>
            <Label className="mb-1 text-sm font-medium text-gray-700">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={isBtnDisabled} type="submit" className={buttonClassName || "px-6 py-2 text-sm font-medium"}>
          {buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
