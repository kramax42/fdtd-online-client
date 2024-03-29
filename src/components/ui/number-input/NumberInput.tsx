import * as React from "react";
import styles from "./NumberInput.module.scss";
import { INumberInputProps } from "./NumberInput.props";
import cn from "clsx";
import { WithLabel } from "components";

export const NumberInput = ({
  value,
  label,
  onChange,
  readOnly = false,
  ...props
}: INumberInputProps): JSX.Element => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const plusButtonHandler = () => {
    if (inputRef.current) {
      triggerInputChange(inputRef.current, (Number(value) + 1).toString());
    }
  };

  const minusButtonHandler = () => {
    // if (inputRef.current) {
    //   inputRef.current.stepDown();
    // }
    if (inputRef.current) {
      triggerInputChange(inputRef.current, (Number(value) - 1).toString());
    }
  };

  // Must be updated for actual React version
  // https://stackoverflow.com/questions/39065010/why-react-event-handler-is-not-called-on-dispatchevent
  const triggerInputChange = (node: HTMLInputElement, inputValue: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(node, "value");

    node.value = `${inputValue}#`;

    if (descriptor && descriptor.configurable) {
      //@ts-ignore
      delete node.value;
    }
    node.value = inputValue;

    const event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, false);
    node.dispatchEvent(event);

    if (descriptor) {
      Object.defineProperty(node, "value", descriptor);
    }
  };

  return (
    <WithLabel labelText={label}>
      <div className={styles.wrapper}>
        <input
          ref={inputRef}
          type="number"
          onChange={onChange}
          placeholder={label}
          value={value}
          name="name"
          min="0"
          max="100"
          readOnly={readOnly}
          required
          {...props}
        />
        <div className={styles.buttons}>
          <button
            onClick={plusButtonHandler}
            className={cn(styles.button, styles.buttonPlus)}
          >
            +
          </button>
          <button
            onClick={minusButtonHandler}
            className={cn(styles.button, styles.buttonMinus)}
          >
            -
          </button>
        </div>
      </div>
    </WithLabel>
  );
};
