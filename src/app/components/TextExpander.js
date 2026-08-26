import { useState } from "react";

function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!children) return null;

  // If it's expanded, show the children(the texts passed into <TextExpander></TextExpander>),
  // else take the first 10 words and display them.
  const displayText = isExpanded
    ? children
    : children.split(" ").slice(0, 10).join(" ") + "...";

  return (
    <span>
      {displayText}{" "}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="text-primary-700 border-b border-primary-700 leading-3 pb-1 inline cursor-pointer"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </span>
  );
}

export default TextExpander;
