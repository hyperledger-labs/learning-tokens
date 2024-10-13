import { useField } from "formik";
import {
  CSSProperties,
  ChangeEvent,
  FC,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  name: string;
  label?: string | ReactNode;
  labelStyle?: string | CSSProperties;
  containerStyle?: string | CSSProperties;
  size?: "small" | "medium" | "large" | "xlarge";
  showOptionalLabel?: boolean;
  validationError?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  noBorder?: boolean;
  helperMessage?: string | ReactNode;
}

const TextInput: FC<Props> = ({
  name,
  label,
  className = "",
  size = "medium",
  showOptionalLabel = false,
  containerStyle,
  labelStyle,
  validationError,
  onChange,
  noBorder = false,
  helperMessage,
  ...rest
}) => {
  const sizeClass = {
    small: "text-xs px-3 h-[32px] rounded",
    medium: "text-base px-4 h-[42px]",
    large: "text-lg px-6 h-[56px]",
    xlarge: "text-xl px-8 h-[72px]",
  }[size];

  const [field, meta] = useField(name || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange({ target: { name, value: e.target.value } });
    onChange && onChange(e);
  };

  return (
    <div
      className={`mb-4 ${typeof containerStyle === "string" && containerStyle}`}
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
      <input
        className={` leading-[1.5] w-full block outline-none ${
          noBorder ? "" : "border border-gray-200 focus:border-primary"
        }  placeholder:text-gray-300 ${sizeClass} ${className}`}
        onChange={handleChange}
        name={name}
        value={rest.value || field.value}
        {...rest}
      />
      {helperMessage &&
        (typeof helperMessage === "string" ? (
          <div className="text-xs text-gray-500">{helperMessage}</div>
        ) : (
          helperMessage
        ))}
      {meta.error && meta.touched && (
        <div className="text-xs text-red-500 mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default TextInput;
