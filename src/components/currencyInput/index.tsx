import { Input } from "@mui/joy";
import React, { useCallback, useState } from "react";
import NumberFormat, {
  NumberFormatBase,
  NumberFormatBaseProps,
  OnValueChange,
} from "react-number-format";
import { BaseType } from "typescript";

/**
 * - A currency component for Brazilian Real
 * - It's based on NumberFormat and accepts all it's props-> https://github.com/s-yadav/react-number-format
 * - The custom input is a Material Ui TextField  and it accepts all it's props -> https://material-ui.com/components/text-fields/
 * - It shouldn't be used with `onChange`, but `onValueChange`
 * - `onValueChange` returns three values, the event itself and the the returned object, which has a shape like this:
 *
```
{
  formattedValue: '$23,234,235.56', //value after applying formatting
  value: '23234235.56', //non formatted value as numeric string 23234235.56, if you are setting this value to state make sure to pass isNumericString prop to true
  floatValue: 23234235.56 //floating point representation. For big numbers it can have exponential syntax
}
```
 */

const CurrencyField = ({ onValueChange }: { onValueChange: (value: number) => void }) => {
  /*
  * The default behavior of the NumberFormat is:
  1- To change the cursor position everytime you press the Backspace key
  2- If you type 123 it evaluates to 123,00 instead of 1,23
  3- When you backspace til the field's empty, the final value is not 0,00, but ""
  To change these 3 behaviors the function onValueChange was changed, 
  a format function was seted and a keydown function was provided
  */
  const [value, setValue] = useState<string | number>("");

  const handleChange = (v: any) => {
    // Set the value to value * 100 because it was divided on the field value prop
    setValue(parseFloat(v.value) * 100);
    if (onValueChange) {
      onValueChange(v.floatValue / 100);
    }
  };

  const currencyFormatter = useCallback((formatted_value: any) => {
    // Set to 0,00 when "" and divide by 100 to start by the cents when start typing
    if (!Number(formatted_value)) return "R$ 0,00";
    const br = { style: "currency", currency: "BRL" };
    return new Intl.NumberFormat("pt-BR", br).format(formatted_value / 100);
  }, []);

  const keyDown = (e: any) => {
    //This if keep the cursor position on erase if the value is === 0
    if (e.code === "Backspace" && !value) {
      e.preventDefault();
    }
    // This if sets the value to 0 and prevent the default for the cursor to keep when there's only cents
    if (e.code === "Backspace" && typeof value === "number" && value < 1000) {
      e.preventDefault();
      setValue(0.0);
      onValueChange(0);
    }
  };

  return (
    <NumberFormatBase
      value={Number(value) / 100}
      format={currencyFormatter}
      onValueChange={handleChange}
      prefix={"R$ "}
      customInput={Input}
      onKeyDown={keyDown}
      removeFormatting={(formattedValue: string) => {
        return formattedValue.replace(/\D/g, "");
      }}
      getCaretBoundary={() => []}
    />
  );
};

export default CurrencyField;
