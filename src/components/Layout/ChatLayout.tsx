import { ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed left-0 top-0 flex w-full h-full justify-center">
      <div className="flex flex-col border border-blue-600 min-h-screen w-full bg-gray-100 px-4 pb-20 lg:w-[400px] lg:relative">{children}</div>
    </div>
  );
};

export default ChatLayout;
