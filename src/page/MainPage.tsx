import ConversationsBar from "@/components/ConversationsBar";
import Loading from "@/components/Loading";

import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
const MessagesBar = lazy(() => import("@/components/MessagesBar"));

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const chatParams = searchParams.get("chat");

  return (
    <>
      <ConversationsBar />
      {chatParams && (
        <Suspense fallback={<Loading />}>
          <MessagesBar chat={chatParams} />
        </Suspense>
      )}
    </>
  );
};

export default MainPage;
