import "katex/dist/katex.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ReactToPrint from "react-to-print";

import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import React, { useRef, useState, useCallback, useEffect } from "react";
import MDEditor, { MDEditorProps } from "@uiw/react-md-editor";

import PdfPreview from "./PdfPreview";

const Editor = () => {
    const pdfRef = useRef(null);
    const [title, setTitle] = useState<string>("");
    const [editorState, setEditorState] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        highlightEnable: true,
        enableScroll: true,
        value: "",
        preview: "live",
    });

    useEffect(() => {
        const fetchReadme = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}README.md`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newText = await response.text();
                setEditorState((prevState) => ({
                    ...prevState,
                    value: newText,
                }));
            } catch (error) {
                console.error('Failed to fetch README.md:', error);
            }
        };

        const text = localStorage.getItem("markdownText");
        if (text) {
            setEditorState((prevState) => ({
                ...prevState,
                value: text,
            }));
        } else {
            fetchReadme();
        }
    }, []);

    const setText = (newText: string): void => {
        setEditorState({
            ...editorState,
            value: newText,
        });
        localStorage.setItem("markdownText", newText);
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const acceptedFile = acceptedFiles.pop();
        const filename = acceptedFile?.name.split(".");
        const extension = filename?.pop();
        if (extension !== undefined && extension.toLowerCase() !== "md") {
            const newTitle = "file type is not supported";
            const newText = "このファイルのプレビューを表示できません。拡張子が`md`のファイルのみ対応しています。";

            setTitle(newTitle);
            setEditorState((prevState) => ({
                ...prevState,
                value: newText,
            }));
            localStorage.clear();
        }
        else {
            const newTitle = filename?.join(".");
            const newText = await acceptedFile?.text();

            setTitle(newTitle ?? "");
            setText(newText ?? "");
        }
    }, [editorState]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

    const saveAsMd = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        const filename = `${title || "untitled"}.md`;
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
                value={title}
                className="title"
                placeholder="タイトル"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTitle(e.target.value);
                }}
            />

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <MDEditor
                    autoFocus
                    value={editorState.value}
                    previewOptions={{
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
                        setText(newText);
                    }}
                />
            </div>

            <div className="doc-tools">
                <div style={{ display: "flex", gap: "0.5em" }}>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={editorState.visibleDragbar}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEditorState({ ...editorState, visibleDragbar: e.target.checked });
                            }}
                        />
                        ドラッグバー
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={editorState.highlightEnable}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEditorState({ ...editorState, highlightEnable: event.target.checked });
                            }}
                        />
                        ハイライト
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={editorState.enableScroll}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEditorState({ ...editorState, enableScroll: event.target.checked });
                            }}
                        />
                        同時スクロール
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={editorState.hideToolbar}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEditorState({ ...editorState, hideToolbar: event.target.checked });
                            }}
                        />
                        ツールバー
                    </label>
                </div>

                <div className="save">
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
                        documentTitle={`${title || "untitled"}.pdf`}
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