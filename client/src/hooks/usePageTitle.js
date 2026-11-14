import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | QueueFlow` : "QueueFlow";
  }, [title]);
};

export default usePageTitle;
