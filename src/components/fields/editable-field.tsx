import { InputAdornment } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import React, {
  ChangeEvent,
  KeyboardEvent,
  FC,
  useCallback,
  useState,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import { FaPen } from "react-icons/all";
import { useStyles } from "../../hooks/use-styles";

interface EditableFieldProps {
  multiline?: boolean;
  trimValue: boolean;
  selectTextOnFocus: boolean;
  submitOnBlur?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rowsMax?: number;
}

const EditableField: FC<EditableFieldProps> = ({
  multiline = false,
  trimValue,
  selectTextOnFocus,
  submitOnBlur = true,
  value,
  onChange,
  placeholder = "",
  rowsMax = 0,
}) => {
  const [isFocused, setFocus] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (inputRef?.current && isFocused && selectTextOnFocus) {
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [isFocused, selectTextOnFocus]);

  useEffect(() => {
    setLocalValue(value);
  }, [value, setLocalValue]);

  const blurInput = useCallback(() => {
    inputRef?.current?.blur();
  }, [inputRef]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLocalValue(event.target.value);
    },
    [setLocalValue]
  );

  const handleSubmit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      blurInput();
      const submittedValue = trimValue ? localValue.trim() : localValue;

      if (submittedValue !== value) {
        onChange(submittedValue);
      }
    },
    [onChange, localValue, blurInput]
  );

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, [setFocus]);

  const handleBlur = useCallback(() => {
    if (submitOnBlur) {
      handleSubmit();
    }
    setFocus(false);
  }, [setFocus, formRef, submitOnBlur, handleSubmit]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        setLocalValue(value);
        setFocus(false);
        blurInput();
      }
    },
    [value, setLocalValue, setFocus, blurInput]
  );

  const classes = useStyles();

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Input
        multiline={multiline}
        type="text"
        inputRef={inputRef}
        fullWidth={true}
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        disableUnderline={!isFocused}
        placeholder={placeholder}
        rowsMax={rowsMax}
        className={classes.editableField}
        endAdornment={
          <InputAdornment position="end">
            <FaPen />
          </InputAdornment>
        }
      />
    </form>
  );
};

export default EditableField;
