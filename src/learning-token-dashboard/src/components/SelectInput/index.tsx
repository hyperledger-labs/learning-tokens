import { useField } from "formik";
import { CSSProperties, FC, InputHTMLAttributes, ReactNode } from "react";

import Select, { SingleValue, components } from "react-select";
type Option = {
  label: string;
  value: string | number;
};

interface Props
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, "size" | "onChange"> {
  label?: string | ReactNode;
  labelStyle?: string | CSSProperties;
  containerStyle?: string | CSSProperties;
  size?: "small" | "medium" | "large" | "xlarge";
  isSearchable?: boolean;
  showOptionalLabel?: boolean;
  isRtl?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  options: Option[];
  onChange?: (value: Option | null) => void;
  noBorder?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string | number;
  menuFooter?: ReactNode;
}

const SelectInput: FC<Props> = ({
  label,
  className = "",
  size = "medium",
  isSearchable = true,
  showOptionalLabel = false,
  isRtl = false,
  isClearable = false,
  containerStyle,
  labelStyle,
  isLoading = false,
  options,
  name,
  onChange,
  noBorder = false,
  disabled = false,
  error,
  value,
  menuFooter,
  ...rest
}) => {
  const sizeClass = {
    small: "text-xs px-3 h-[32px]",
    medium: "text-base px-4 h-[42px]",
    large: "text-lg px-6 h-[56px]",
    xlarge: "text-xl px-8 h-[72px]",
  }[size];

  const [field, meta] = name
    ? useField(name || "")
    : [null, null, null];

  const handleOnChange = (
    option: SingleValue<Option>
  ) => {
    field && field.onChange({ target: { name, value: option?.value } });
    onChange && onChange(option);
  };

  return (
    <div
      className={`mb-3 ${typeof containerStyle === "string" && containerStyle}`}
      style={
        (typeof containerStyle === "object" && containerStyle) || undefined
      }
    >
      {label && (
        <label
          className={`inline-block mb-1 text-xs text-gray-500 ${
            typeof labelStyle === "string" && labelStyle
          }`}
          style={(typeof labelStyle === "object" && labelStyle) || undefined}
        >
          {label}
          {showOptionalLabel && (
            <span className="text-gray-400"> (Optional)</span>
          )}
        </label>
      )}
      <Select
        defaultValue={options.find((option) => option.value === value)}
        value={options.find((option) => option.value === field?.value)}
        menuPlacement="auto"
        options={options}
        classNames={{
          control: () => sizeClass,
          indicatorSeparator: () => "hidden",
          placeholder: () => "!text-gray-300",
          menuPortal: () => "!z-[1100]",
        }}
        components={{
          MenuList: ({ children, selectProps, ...rest }) => {
            return (
              <div className="text-xs">
                <components.MenuList {...rest} selectProps={selectProps}>
                  {children}
                </components.MenuList>
                {menuFooter && menuFooter}
              </div>
            );
          },
        }}
        isDisabled={disabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
        menuPosition="fixed"
        placeholder={rest.placeholder}
        onChange={handleOnChange}
        menuPortalTarget={document.body}
      />
      {meta && meta.touched && meta.error ? (
        <div className="text-xs text-red-500 mt-1">{meta.error}</div>
      ) : null}
      {error ? <div className="text-xs text-red-500 mt-1">{error}</div> : null}
    </div>
  );
};

export default SelectInput;
