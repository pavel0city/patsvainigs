"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TermData {
  [key: string]: string;
}

function TermTooltip({ text, definition }: { text: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isTouch = useRef(false);

  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  return (
    <span className="term-wrapper" ref={ref}>
      <span
        className="term"
        onTouchStart={() => { isTouch.current = true; }}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => {
          if (!isTouch.current) setOpen(true);
        }}
        onMouseLeave={() => {
          if (!isTouch.current) setOpen(false);
        }}
      >
        {text}
      </span>
      {open && (
        <span className="term-tooltip">{definition}</span>
      )}
    </span>
  );
}

function UnknownTerm({ text }: { text: string }) {
  return <span className="term term-unknown">{text}</span>;
}

type InlineNode =
  | { type: "text"; value: string }
  | { type: "italic"; children: InlineNode[] }
  | { type: "term"; name: string; hasCite: boolean };

// First pass: extract <t> tags from a string
function parseTerms(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const regex = /<t>(.*?)<\/t>(\s*<c>)?/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    nodes.push({ type: "term", name: match[1], hasCite: !!match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  }

  return nodes;
}


function parseInline(text: string): InlineNode[] {
  // First extract _italic_ (which may contain <t> tags), then parse <t> in remaining text
  const nodes: InlineNode[] = [];
  const regex = /_(.*?)_/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Non-italic text — parse for terms
      nodes.push(...parseTerms(text.slice(lastIndex, match.index)));
    }
    // Italic content — parse for terms inside
    const innerNodes = parseTerms(match[1]);
    nodes.push({ type: "italic", children: innerNodes });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(...parseTerms(text.slice(lastIndex)));
  }

  return nodes;
}

function RenderNode({ node, terms, nodeKey }: { node: InlineNode; terms: TermData; nodeKey: number }) {
  switch (node.type) {
    case "text":
      return <span key={nodeKey}>{node.value}</span>;
    case "italic":
      return (
        <em key={nodeKey}>
          {node.children.map((child, j) => (
            <RenderNode key={j} node={child} terms={terms} nodeKey={j} />
          ))}
        </em>
      );
    case "term": {
      const label = node.hasCite ? `${node.name} <c>` : node.name;
      const definition = terms[node.name.toLowerCase()];
      if (definition) {
        return <TermTooltip key={nodeKey} text={label} definition={definition} />;
      }
      return <UnknownTerm key={nodeKey} text={label} />;
    }
  }
}

function RenderInline({ nodes, terms }: { nodes: InlineNode[]; terms: TermData }) {
  return (
    <>
      {nodes.map((node, i) => (
        <RenderNode key={i} node={node} terms={terms} nodeKey={i} />
      ))}
    </>
  );
}

export default function RichContent({
  content,
  terms,
}: {
  content: string;
  terms: TermData;
}) {
  const paragraphs = content.split("\n");

  return (
    <div className="post-content">
      {paragraphs.map((para, i) => {
        if (!para.trim()) return null;
        const nodes = parseInline(para);
        return (
          <p key={i}>
            <RenderInline nodes={nodes} terms={terms} />
          </p>
        );
      })}
    </div>
  );
}
