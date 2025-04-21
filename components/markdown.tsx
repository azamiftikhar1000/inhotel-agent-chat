"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
  //@ts-ignore
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, DotIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { CodeBlock } from "./codeblock";
import type { Components } from "react-markdown";

// Helper type to extract specific props we want to handle
type MarkdownComponentProps = {
  node?: any;
  className?: string;
  [key: string]: any;
};

export function Markdown({
  content,
  fontSize = "sm",
  truncate = false,
  maxLength = 150,
}: {
  content: string;
  fontSize?: "xs" | "sm" | "md" | "lg";
  truncate?: boolean;
  maxLength?: number;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const processedContent = truncate
    ? content.length > maxLength
      ? content.slice(0, maxLength).split(" ").slice(0, 50).join(" ") + "..."
      : content
    : content;

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const fontSizeClasses = {
    xs: "text-xs leading-5",
    sm: "text-sm leading-6",
    md: "text-base leading-7",
    lg: "text-lg leading-8",
  };

  // Define components with properly typed props
  const components: Components = {
    h1: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h1
        className={`first:mt-0 mb-4 mt-8 text-4xl font-bold tracking-tight text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h2
        className={`first:mt-0 mb-3 mt-6 text-3xl font-semibold tracking-tight text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h3
        className={`first:mt-0 mb-3 mt-5 text-2xl font-medium tracking-tight text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h4
        className={`first:mt-0 mb-2 mt-4 text-xl font-medium tracking-tight text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h5
        className={`first:mt-0 mb-2 mt-4 text-lg font-medium text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, className, ...props }: MarkdownComponentProps) => (
      <h6
        className={`first:mt-0 mb-2 mt-3 text-base font-medium text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </h6>
    ),
    p: ({ children, className, ...props }: MarkdownComponentProps) => (
      <p
        className={`first:my-0 my-2 text-foreground/70 ${fontSizeClasses[fontSize]} ${className || ''}`}
        {...props}
      >
        {children}
      </p>
    ),
    a: ({ children, className, ...props }: MarkdownComponentProps) => (
      <a
        className={`text-primary hover:text-primary/80 underline transition-colors duration-200 ${className || ''}`}
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, className, ...props }: MarkdownComponentProps) => (
      <ul
        className={`list-item list-inside pl-6 space-y-1 text-foreground/70 ${fontSizeClasses[fontSize]} ${className || ''}`}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, className, ...props }: MarkdownComponentProps) => (
      <ol
        className={`list-decimal space-y-1 text-foreground/70 ${fontSizeClasses[fontSize]} ${className || ''}`}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: MarkdownComponentProps) => (
      <li className="flex justify-start items-start" {...props}>
        <DotIcon className="text-muted-foreground" />
        <span>{children}</span>
      </li>
    ),
    blockquote: ({ children, className, ...props }: MarkdownComponentProps) => (
      <blockquote
        className={`border-l-4 border-primary pl-4 italic text-muted-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </blockquote>
    ),
    hr: ({ className, ...props }: MarkdownComponentProps) => (
      <hr
        className={`my-6 border-border ${className || ''}`}
        {...props}
      />
    ),
    table: ({ children, className, ...props }: MarkdownComponentProps) => (
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-border ${className || ''}`}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, className, ...props }: MarkdownComponentProps) => (
      <th
        className={`px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider ${className || ''}`}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, className, ...props }: MarkdownComponentProps) => (
      <td
        className={`px-4 py-3 text-sm text-foreground ${className || ''}`}
        {...props}
      >
        {children}
      </td>
    ),
    tr: ({ children, className, ...props }: MarkdownComponentProps) => (
      <tr
        className={`bg-background even:bg-muted ${className || ''}`}
        {...props}
      >
        {children}
      </tr>
    ),
    code({ node, inline, className, children, ...props }: MarkdownComponentProps & { inline?: boolean }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <CodeBlock
          language={match[1]}
          value={children as string}
          fontSize={fontSize}
        />
      ) : (
        <code
          className={`${className || ''} px-1 py-0.5 rounded bg-muted text-muted-foreground`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <ReactMarkdown
      className={`prose max-w-none ${isDarkMode ? "prose-invert" : ""} ${fontSizeClasses[fontSize]} max-w-full overflow-x-auto`}
      remarkPlugins={[rehypeHighlight as any]}
      components={components}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
