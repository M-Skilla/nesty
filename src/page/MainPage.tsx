import ConversationProfile from "@/components/ConversationProfile";
import ConversationsBar from "@/components/ConversationsBar";
import Loading from "@/components/Loading";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

import { lazy, Suspense, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const MessagesBar = lazy(() => import("@/components/MessagesBar"));

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const chatParams = searchParams.get("chat");
  const { user } = useCurrentUser();
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);
  useEffect(() => {
    if (user) {
      updateOnlineStatus({ userId: user._id, isOnline: true });

      return () => {
        const offlineUpdate = updateOnlineStatus;
        offlineUpdate({ userId: user._id, isOnline: false });
      };
    }
  }, [user]);

  return (
    <>
      <ConversationsBar />
      {chatParams && (
        <>
          <Suspense fallback={<Loading />}>
            <MessagesBar chat={chatParams} />
          </Suspense>
          <ConversationProfile chat={chatParams} />
        </>
      )}
    </>
  );
};

export default MainPage;
