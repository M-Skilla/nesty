import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export const useStoreEffect = () => {
  console.log("Start");
  const { isLoading, isAuthenticated } = useConvexAuth();

  const { user } = useUser();

  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;

    const createUser = async () => {
      const id = await storeUser();

      setUserId(id);
    };

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
};
