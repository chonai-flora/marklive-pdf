import "katex/dist/katex.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactToPrint from "react-to-print";

import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState, useCallback } from "react";
import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";

import PdfPreview from "./PdfPreview";

import { MarkdownStateProps, updateMarkdown } from "../slices/markdown-slice";

const Editor = () => {
    const pdfRef = useRef(null);
    const dispatch = useDispatch();
    const markdownState = useSelector((state: { markdown: MarkdownStateProps }) => state.markdown);
    const [editorState, setEditorState] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        highlightEnable: true,
        enableScroll: true,
        value: markdownState.text,
        preview: "live",
    });

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const acceptedFile = acceptedFiles.pop();
        const filename = acceptedFile?.name.split(".");
        const extension = filename?.pop();
        if (extension !== undefined && extension.toLowerCase() !== "md") {
            const newTitle = "file type is not supported";
            const newText = "このファイルのプレビューを表示できません。拡張子が`md`のファイルのみ対応しています。";

            setEditorState({
                ...editorState,
                value: newText
            });
            dispatch(updateMarkdown({
                title: newTitle,
                text: newText,
            }));
        }
        else {
            const newTitle = filename?.join(".");
            const newText = await acceptedFile?.text();
            setEditorState({
                ...editorState,
                value: newText
            });
            dispatch(updateMarkdown({
                title: newTitle || "",
                text: newText || "",
            }));
        }
    }, [dispatch, editorState]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

    const saveAsMd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        const filename = `${markdownState.title || "untitled"}.md`;
        const file = new File(
            [editorState.value!],
            filename,
            {
                type: "text/plain;charset=utf-8"
            },
        );
        saveAs(file);
    }

    return (
        <div data-color-mode="light" >
            <input
                type="text"
                value={markdownState.title}
                className="title"
                placeholder="タイトル"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateMarkdown({
                        ...markdownState,
                        title: markdownState.title,
                    }))
                }
            />

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <MDEditor
                    autoFocus
                    value={editorState.value}
                    previewOptions={{
                        linkTarget: "_blank",
                        remarkPlugins: [remarkMath],
                        rehypePlugins: [rehypeKatex]
                    }}
                    height={400}
                    highlightEnable={editorState.highlightEnable}
                    hideToolbar={!editorState.hideToolbar}
                    enableScroll={editorState.enableScroll}
                    visibleDragbar={editorState.visibleDragbar}
                    textareaProps={{
                        placeholder: "記事やレポートをMarkdown形式で記述してください",
                    }}
                    preview={editorState.preview}
                    onChange={(newText = "") => {
                        setEditorState({ ...editorState, value: newText });
                        dispatch(updateMarkdown({
                            ...markdownState,
                            text: newText,
                        }))
                    }}
                />
            </div>

            <div className="doc-tools">
                <label>
                    <input
                        type="checkbox"
                        checked={editorState.visibleDragbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEditorState({ ...editorState, visibleDragbar: e.target.checked });
                        }}
                    />
                    ドラッグバー
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={editorState.highlightEnable}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEditorState({ ...editorState, highlightEnable: e.target.checked });
                        }}
                    />
                    ハイライト
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={editorState.enableScroll}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEditorState({ ...editorState, enableScroll: e.target.checked });
                        }}
                    />
                    同時スクロール
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={editorState.hideToolbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEditorState({ ...editorState, hideToolbar: e.target.checked });
                        }}
                    />
                    ツールバー
                </label>
                <div className="save-button">
                    <button
                        type="button"
                        disabled={!editorState.value}
                        style={{ marginLeft: 10 }}
                        onClick={saveAsMd}
                    >
                        Markdown形式で保存
                    </button>
                    <ReactToPrint
                        trigger={() => (
                            <button
                                type="button"
                                disabled={!editorState.value}
                                style={{ marginLeft: 10 }}
                            >
                                PDF形式にエクスポート
                            </button>
                        )}
                        content={() => pdfRef.current}
                        documentTitle={`${markdownState.title || "untitled"}.pdf`}
                    />
                </div>
            </div>
            <br />

            <hr />
            <h3>PDF Preview</h3>
            <div ref={pdfRef}>
                {editorState.value && (
                    editorState.value.split("<br>").map((section) => <PdfPreview source={section} />)
                )}
            </div>
        </div >
    );
};

export default Editor;