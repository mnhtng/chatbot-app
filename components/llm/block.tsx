import type { CodeToHtmlOptions } from "@llm-ui/code";
import {
    loadHighlighter,
    useCodeBlockToHtml,
    allLangs,
    allLangsAlias,
} from "@llm-ui/code";
import { bundledThemes } from "shiki/themes";
import { createOnigurumaEngine } from "shiki";
import { type LLMOutputComponent } from "@llm-ui/react";
import parseHtml from "html-react-parser";
import { createHighlighterCore } from "shiki/core";
import { bundledLanguagesInfo } from "shiki/langs";
import getWasm from "shiki/wasm";

const highlighter = loadHighlighter(
    createHighlighterCore({
        engine: createOnigurumaEngine(getWasm),
        langs: allLangs(bundledLanguagesInfo),
        langAlias: allLangsAlias(bundledLanguagesInfo),
        themes: Object.values(bundledThemes),
    }),
);

const codeToHtmlOptions: CodeToHtmlOptions = {
    theme: "github-dark",
};

const CodeBlock: LLMOutputComponent = ({ blockMatch }) => {
    const { html, code } = useCodeBlockToHtml({
        markdownCodeBlock: blockMatch.output,
        highlighter,
        codeToHtmlOptions,
    });

    if (!html) {
        return (
            <pre className="shiki">
                <code>{code}</code>
            </pre>
        );
    }

    return <>{parseHtml(html)}</>;
};

export default CodeBlock;