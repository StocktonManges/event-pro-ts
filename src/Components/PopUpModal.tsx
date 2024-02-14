export const PopUpModal = ({
  message,
  buttonPropsArr,
}: {
  message: string;
  buttonPropsArr: React.ButtonHTMLAttributes<HTMLButtonElement>[];
}) => {
  return (
    <section id="pop-up-modal-bg">
      <div className="pop-up-modal">
        <span>{message}</span>
        <div>
          {buttonPropsArr.map((buttonProps, index) => (
            <button key={index} {...buttonProps} />
          ))}
        </div>
      </div>
    </section>
  );
};
