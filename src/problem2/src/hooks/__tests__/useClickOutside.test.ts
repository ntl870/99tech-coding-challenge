import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "../useClickOutside";

describe("useClickOutside", () => {
  it("should initialize without errors", () => {
    const callback = vi.fn();

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside({ ref, callback });
      return { ref };
    });

    expect(result.current.ref.current).toBe(null);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback when clicking outside element", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside({ ref, callback });
      return { ref };
    });

    // Create mock elements
    const mockElement = document.createElement("div");
    const outsideElement = document.createElement("div");

    // Set up ref
    Object.defineProperty(result.current.ref, "current", {
      writable: true,
      value: mockElement,
    });

    // Mock contains method to return false (outside click)
    mockElement.contains = vi.fn().mockReturnValue(false);

    // Simulate outside click
    const event = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(event, "target", { value: outsideElement });

    document.dispatchEvent(event);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking inside element", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside({ ref, callback });
      return { ref };
    });

    const mockElement = document.createElement("div");
    const insideElement = document.createElement("span");

    Object.defineProperty(result.current.ref, "current", {
      writable: true,
      value: mockElement,
    });

    // Mock contains method to return true (inside click)
    mockElement.contains = vi.fn().mockReturnValue(true);

    const event = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(event, "target", { value: insideElement });

    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not error when ref is null", () => {
    const callback = vi.fn();
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside({ ref, callback });
      return { ref };
    });

    const event = new MouseEvent("mousedown", { bubbles: true });
    document.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
