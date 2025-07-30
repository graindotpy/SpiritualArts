import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipKeyword {
  keyword: string;
  definition: string;
}

interface TooltipTextProps {
  text: string;
  tooltips: TooltipKeyword[];
  className?: string;
}

export default function TooltipText({ text, tooltips, className }: TooltipTextProps) {
  if (!tooltips || tooltips.length === 0) {
    return <div className={className}>{text}</div>;
  }

  // Create a regex pattern to match all keywords (case-insensitive)
  const keywordPattern = new RegExp(
    `\\b(${tooltips.map(t => t.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = keywordPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Find the tooltip definition for this keyword
    const tooltip = tooltips.find(t => 
      t.keyword.toLowerCase() === match[0].toLowerCase()
    );

    if (tooltip) {
      parts.push(
        <TooltipProvider key={match.index}>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <span className="text-spiritual-600 dark:text-spiritual-400 underline decoration-dotted cursor-help font-medium">
                {match[0]}
              </span>
            </TooltipTrigger>
            <TooltipContent 
              className="max-w-xs bg-white dark:bg-gray-800 border border-spiritual-200 dark:border-spiritual-600 shadow-lg"
              side="top"
            >
              <div className="space-y-2">
                <h4 className="font-semibold text-spiritual-700 dark:text-spiritual-300">
                  {tooltip.keyword}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {tooltip.definition}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <div className={`${className} whitespace-pre-line`}>
      {parts.map((part, index) => (
        typeof part === 'string' ? part : <span key={index}>{part}</span>
      ))}
    </div>
  );
}

export type { TooltipKeyword };