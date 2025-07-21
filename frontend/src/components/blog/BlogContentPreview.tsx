import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface BlogContentPreviewProps {
  content: string;
  uploadedImages?: Record<string, string>;
}

interface CodeComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const createComponents = (
  uploadedImages: Record<string, string>
): Components => ({
  img: ({ src, alt, ...props }) => {
    const resolvedSrc = uploadedImages[src || ""] || src;

    return (
      <img
        src={resolvedSrc}
        alt={alt || ""}
        style={{ maxWidth: "50%", height: "auto" }}
        {...props}
      />
    );
  },
  code({ node, inline, className, children, ...props }: CodeComponentProps) {
    const getTextContent = (children: React.ReactNode): string => {
      if (typeof children === "string") return children;
      if (typeof children === "number") return children.toString();
      if (Array.isArray(children)) {
        return children.map((child) => getTextContent(child)).join("");
      }
      if (React.isValidElement(children)) {
        return getTextContent(children.props.children);
      }
      return "";
    };

    const codeContent = getTextContent(children);
    const match = /language-(\w+)/.exec(className || "");

    const shouldBeCodeBlock =
      !inline ||
      className?.includes("language-") ||
      codeContent.includes("\n") ||
      codeContent.length > 30;

    if (shouldBeCodeBlock) {
      return (
        <div style={{ margin: "1rem 0" }}>
          <SyntaxHighlighter
            style={a11yDark}
            language={match?.[1] || "text"}
            PreTag="div"
            showLineNumbers={true}
            wrapLines={true}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className={className}
        style={{
          backgroundColor: "#f4f4f4",
          padding: "2px 4px",
          borderRadius: "3px",
          fontFamily: "monospace",
        }}
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: ({ className, ...props }) => {
    const getHrStyle = (className?: string) => {
      switch (className) {
        case "thick":
          return {
            border: "none",
            borderTop: "4px solid #333",
            margin: "3rem 0",
            width: "100%",
          };
        case "dotted":
          return {
            border: "none",
            borderTop: "2px dotted #999",
            margin: "2rem 0",
            width: "100%",
          };
        case "gradient":
          return {
            border: "none",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, #333, transparent)",
            margin: "2rem 0",
            width: "100%",
          };
        case "short":
          return {
            border: "none",
            borderTop: "2px solid #e1e5e9",
            margin: "2rem auto",
            width: "50%",
          };
        case "dashed":
          return {
            border: "none",
            borderTop: "2px dashed #666",
            margin: "2rem 0",
            width: "100%",
          };
        default:
          return {
            border: "none",
            borderTop: "2px solid #e1e5e9",
            margin: "2rem 0",
            width: "100%",
          };
      }
    };

    return <hr style={getHrStyle(className)} {...props} />;
  },
  p: ({ children, ...props }) => (
    <p
      style={{
        marginBottom: "1.5rem",
        lineHeight: "1.7",
        textAlign: "justify",
      }}
      {...props}
    >
      {children}
    </p>
  ),

  h1: ({ children, ...props }) => (
    <h1
      style={{
        marginTop: "2.5rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.8rem",
        borderBottom: "2px solid #e1e5e9",
        paddingBottom: "0.5rem",
      }}
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2
      style={{
        marginTop: "2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        lineHeight: "1.3",
      }}
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3
      style={{
        marginTop: "1.5rem",
        fontSize: "1rem",
        fontWeight: "semibold",
        marginBottom: "0.75rem",
        lineHeight: "1.4",
      }}
      {...props}
    >
      {children}
    </h3>
  ),
  ol: ({ children, ...props }) => (
    <ol
      style={{ marginBottom: "1.5rem", paddingLeft: "2rem", lineHeight: 1.7 }}
      {...props}
    >
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul
      style={{
        marginBottom: "1.5rem",
        paddingLeft: "2rem",
        lineHeight: 1.7,
        listStyle: "disc",
      }}
      {...props}
    >
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li style={{ marginBottom: "0.5rem", lineHeight: 1.7 }} {...props}>
      {children}
    </li>
  ),
});

const BlogContentPreview: React.FC<BlogContentPreviewProps> = ({
  content,
  uploadedImages = {},
}) => {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={createComponents(uploadedImages)}
        remarkPlugins={[remarkBreaks, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogContentPreview;
