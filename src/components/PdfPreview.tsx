import "katex/dist/katex.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import MDEditor from "@uiw/react-md-editor";

const PdfPreview = (props: { source: string }) => {
    return (
        <div id="pdf" data-color-mode="light" style={{ marginBottom: "80px" }}>
            <MDEditor.Markdown
                style={{ margin: "30px", pageBreakAfter: "always" }}
                disableCopy={true}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                source={props.source || ""}
            />
        </div>
    );
}

export default PdfPreview;