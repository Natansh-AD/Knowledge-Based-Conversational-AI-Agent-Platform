import { useEffect } from "react";
import { useTitle } from "./TitleContext";

export default function usePageTitle(title) {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(title);
  }, [title]);
}