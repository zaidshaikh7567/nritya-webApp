import { useLayoutEffect, useState } from "react";

const useOutOfView = (ref) => {
  const [isOutOfView, setIsOutOfView] = useState(false);

  useLayoutEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfView(!entry.isIntersecting);
      },
      {
        threshold: 0.01,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return isOutOfView;
};

export default useOutOfView;
