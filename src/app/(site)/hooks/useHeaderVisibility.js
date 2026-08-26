"use client";

import { useEffect, useRef, useState } from "react";

function useHeaderVisibility() {
  const [showHeader, setShowHeader] = useState(true);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeader(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return { showHeader, targetRef };
}

export default useHeaderVisibility;
