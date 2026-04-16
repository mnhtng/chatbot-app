import { type LLMOutputComponent } from "@llm-ui/react";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";

const Markdown: LLMOutputComponent = ({ blockMatch }) => {
    const markdown = blockMatch.output;
    return (
        <Streamdown mode="streaming" parseIncompleteMarkdown>
            {markdown}
        </Streamdown>
    );
};

export default Markdown;
