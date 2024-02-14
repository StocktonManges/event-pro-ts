import { ChatFeature } from "./ChatFeature";
import { ChatList } from "./ChatList";

export const ChatsTab = () => {
  return (
    <>
      <section className="chats-tab flex-container">
        <ChatList />
        <ChatFeature />
      </section>
    </>
  );
};
