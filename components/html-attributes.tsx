"use client";

import { useEffect } from "react";

interface HtmlAttributesProps {
  lang: string;
  dir: "ltr" | "rtl";
}

export function HtmlAttributes({ lang, dir }: HtmlAttributesProps) {
  useEffect(() => {
    // Update the html element's lang and dir attributes
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [lang, dir]);

  return null;
}

