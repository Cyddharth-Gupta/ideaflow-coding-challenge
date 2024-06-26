import AsyncCreatableSelect from "react-select/async-creatable";
import { ColourOption, colourOptions } from "./data";

const filterColors = (inputValue: string) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue: string) =>
  new Promise<ColourOption[]>((resolve) => {
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

const CustomSelect =  () => (
  <AsyncCreatableSelect
    cacheOptions
    defaultOptions
    loadOptions={promiseOptions}
    components={{
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
    }}
  />
);

export default CustomSelect;
