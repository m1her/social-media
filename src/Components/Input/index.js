import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { forwardRef } from "react";

const Input = forwardRef(
  ({ type, placeholder, onChange, error }, ref) => {
    return (
      <div className="wrap-input100">
        <input
          className={`input100 outline-none ${error}`}
          type={type ? type : "text"}
          name="email"
          placeholder={placeholder}
          ref={ref}
          onChange={onChange}
        />
        <span className="focus-input100"></span>
        <span className="symbol-input100 ">
          {type == "password" ? (
            <FontAwesomeIcon
              icon={faLock}
              width={15}
              height={15}
              className={error ? "text-red-400" : " "}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEnvelope}
              width={15}
              height={15}
              className={error ? "text-red-400" : " "}
            />
          )}
        </span>
      </div>
    );
  }
);
export default Input;
