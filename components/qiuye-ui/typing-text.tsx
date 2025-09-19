"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface TypingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string | string[];
  speed?: number;
  loop?: boolean;
  showCursor?: boolean;
}

const TypingText = React.forwardRef<HTMLDivElement, TypingTextProps>(
  ({ 
    className, 
    text, 
    speed = 100, 
    loop = false, 
    showCursor = true, 
    ...props 
  }, ref) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const textArray = Array.isArray(text) ? text : [text];
    const currentText = textArray[currentTextIndex];

    useEffect(() => {
      if (isPaused) return;

      const timeout = setTimeout(() => {
        if (!isDeleting) {
          // 正在输入
          if (currentIndex < currentText.length) {
            setDisplayedText(currentText.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            // 输入完成，如果是数组且启用循环，则暂停后开始删除
            if (textArray.length > 1 && loop) {
              setIsPaused(true);
              setTimeout(() => {
                setIsDeleting(true);
                setIsPaused(false);
              }, 1000); // 暂停1秒
            } else if (textArray.length === 1 && loop) {
              // 单个文本循环
              setIsPaused(true);
              setTimeout(() => {
                setIsDeleting(true);
                setIsPaused(false);
              }, 1000);
            }
          }
        } else {
          // 正在删除
          if (currentIndex > 0) {
            setDisplayedText(currentText.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            // 删除完成，切换到下一个文本
            setIsDeleting(false);
            if (textArray.length > 1) {
              setCurrentTextIndex((currentTextIndex + 1) % textArray.length);
            }
          }
        }
      }, isDeleting ? speed / 2 : speed); // 删除速度比输入速度快一倍

      return () => clearTimeout(timeout);
    }, [currentIndex, currentText, currentTextIndex, isDeleting, isPaused, loop, speed, textArray]);

    return (
      <div
        className={cn("inline-flex items-center", className)}
        ref={ref}
        {...props}
      >
        <span className="font-mono">
          {displayedText}
          {showCursor && (
            <span className="ml-0.5 animate-pulse text-foreground/60">|</span>
          )}
        </span>
      </div>
    );
  }
);

TypingText.displayName = "TypingText";

export { TypingText };
