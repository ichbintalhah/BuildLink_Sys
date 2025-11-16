import React, { useState, useEffect, useRef } from "react";
import LoginForm from "./LoginForm.jsx";
import SignUpUserForm from "./SignUpUserForm.jsx";
import SignUpContractorForm from "./SignUpContractorForm.jsx"; // 1. Import Contractor Form

const AuthModal = ({ open, onClose }) => {
  const [tab, setTab] = useState("login");
  const dialogRef = useRef(null);
  // 2. Add the new state variable here
  const [signUpType, setSignUpType] = useState(null); // 'user', 'contractor', or null

  useEffect(() => {
    const modal = dialogRef.current;
    if (open) {
      modal.showModal();
    } else if (modal) {
      modal.close();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset signUpType when modal closes or tab changes
  useEffect(() => {
    if (!open || tab === "login") {
      setSignUpType(null);
    }
  }, [open, tab]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box w-11/11 max-w-md relative">
        <div role="tablist" className="tabs tabs-boxed tabs-lg">
          <a
            role="tab"
            className={`tab ${tab === "login" ? "tab-active tab-primary" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </a>
          <a
            role="tab"
            className={`tab ${
              tab === "signup" ? "tab-active tab-secondary" : ""
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </a>
        </div>

        <div className="py-4">
          {tab === "login" ? (
            <LoginForm onClose={onClose} />
          ) : (
            // --- 3. This entire 'div' replaces the old Sign Up content ---
            <div>
              {/* Show the choice first */}
              {!signUpType && (
                <div className="text-center space-y-4 py-6">
                  <h3 className="font-bold text-lg">Choose Account Type:</h3>
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => setSignUpType("user")}
                  >
                    I need construction services (User)
                  </button>
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => setSignUpType("contractor")}
                  >
                    I provide construction services (Contractor)
                  </button>
                </div>
              )}

              {/* Show the correct form based on the choice */}
              {signUpType === "user" && <SignUpUserForm onClose={onClose} />}
              {signUpType === "contractor" && (
                <SignUpContractorForm onClose={onClose} />
              )}

              {/* Add a 'Back' button if a form is shown */}
              {signUpType && (
                <button
                  className="btn btn-sm btn-ghost mt-4"
                  onClick={() => setSignUpType(null)} // Go back to the choice
                >
                  &larr; Back to Account Type Choice
                </button>
              )}
            </div>
            // --- End of replacement ---
          )}
        </div>

        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Background closes on click */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AuthModal;
