import { Loader2 } from "lucide-react";

type LoadingProps = {
  withText?: boolean;
};

const Loading = ({ withText }: LoadingProps) => {
  return (
    <div className="flex gap-2">
      <Loader2 className={`animate-spin ${withText ? "h-9 w-9" : "h-5 w-5"}`} />
      {withText ? <span>Loading...</span> : ""}
    </div>
  );
};

export default Loading;
