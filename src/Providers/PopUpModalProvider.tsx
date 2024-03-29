import { ReactNode, createContext, useContext, useState } from "react";

type TypePopUpModalProvider = {
  popUpModalVisible: boolean;
  popUpModalButtonPropsArr: React.ButtonHTMLAttributes<HTMLButtonElement>[];
  popUpModalMessage: string;
  triggerPopUpModal: (
    message: string,
    buttonPropsArr: React.ButtonHTMLAttributes<HTMLButtonElement>[]
  ) => void;
  exitPopUpModal: () => void;
};

const PopUpModalContext = createContext<TypePopUpModalProvider>(
  {} as TypePopUpModalProvider
);
export const UsePopUpModal = () => useContext(PopUpModalContext);

export const PopUpModalProvider = ({ children }: { children: ReactNode }) => {
  const [popUpModalVisible, setPopUpModalVisible] = useState<boolean>(false);
  const [popUpModalMessage, setPopUpModalMessage] = useState<string>("");
  const [popUpModalButtonPropsArr, setPopUpModalButtonPropsArr] = useState<
    React.ButtonHTMLAttributes<HTMLButtonElement>[]
  >([]);

  const triggerPopUpModal = (
    message: string,
    buttonPropsArr: React.ButtonHTMLAttributes<HTMLButtonElement>[]
  ) => {
    setPopUpModalButtonPropsArr(buttonPropsArr);
    setPopUpModalMessage(message);
    setPopUpModalVisible(true);
  };

  const exitPopUpModal = () => {
    setPopUpModalButtonPropsArr([]);
    setPopUpModalMessage("");
    setPopUpModalVisible(false);
  };

  return (
    <PopUpModalContext.Provider
      value={{
        popUpModalVisible,
        popUpModalButtonPropsArr,
        popUpModalMessage,
        triggerPopUpModal,
        exitPopUpModal,
      }}
    >
      {children}
    </PopUpModalContext.Provider>
  );
};
