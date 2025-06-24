import { useEffect } from "react";

interface UseClickOutsideProps {
  ref: React.RefObject<HTMLElement | null>;
  callback: () => void;
}

export function useClickOutside({ ref, callback }: UseClickOutsideProps): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}
