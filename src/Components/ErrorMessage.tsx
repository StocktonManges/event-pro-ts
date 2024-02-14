export const ErrorMessage = ({
  message,
  isDisplayed,
}: {
  message: string;
  isDisplayed: boolean;
}) => {
  return isDisplayed && <div className="error-message">{message}</div>;
};
