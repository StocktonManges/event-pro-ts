import { useRef } from "react";
import { AccountNameTypes, accountNameTypesSchema } from "../../utils/types";
import toast from "react-hot-toast";
import { UseAuth } from "../../Providers/AuthProvider";
import { UseNav } from "../../Providers/NavProvider";

export const SelectAccountTypeForm = () => {
  const accountTypeRef = useRef<AccountNameTypes | null>(null);
  const { setNewAccountType } = UseAuth();
  const { navigate, navUrls } = UseNav();

  return (
    <section className="select-account-type-form">
      <div>
        <h3>What kind of account are you looking for?</h3>
        <h3>I want to...</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!accountTypeRef.current) {
              toast.error("Select an account type.");
              return;
            }
            setNewAccountType(accountTypeRef.current);
            navigate(navUrls.createAccount);
            sessionStorage.setItem("newAccountType", accountTypeRef.current);
          }}
        >
          <div>
            {["Client", "ServiceProvider"].map((item, index) => (
              <div key={index}>
                <input
                  type="radio"
                  name="account-type"
                  id={item}
                  onChange={(e) => {
                    accountTypeRef.current = accountNameTypesSchema.parse(
                      e.target.id
                    );
                  }}
                />
                <label htmlFor={item}>
                  {item === "Client" ? "book events." : "provide services."}
                </label>
              </div>
            ))}
          </div>
          <div>
            <button type="submit">Continue</button>
            <span
              onClick={() => {
                navigate(navUrls.home);
              }}
            >
              Cancel
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};
