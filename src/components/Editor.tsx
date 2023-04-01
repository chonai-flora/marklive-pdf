import React, { useRef, useState, useEffect, useCallback } from 'react';
import 'katex/dist/katex.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { saveAs } from 'file-saver';
import ReactToPrint from 'react-to-print';
import { useDropzone } from 'react-dropzone';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';

import PdfPreview from './PdfPreview';

const Editor = () => {
    const pdfRef = useRef(null);

    const [mdTitle, setTitle] = useState<string>(``);
    const [state, setVisible] = useState<MDEditorProps>({
        visibleDragbar: true,
        hideToolbar: true,
        highlightEnable: true,
        enableScroll: true,
        value: ``,
        preview: 'live',
    });
    useEffect(() => {
        const fetchReadme = async () => {
            const path = "https://raw.githubusercontent.com/chonai-flora/marklive-pdf/main/README.md";
            const resp = await fetch(path);
            const text = await resp.text();
            setVisible({ ...state, value: text });
        }
        fetchReadme();
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const acceptedFile = acceptedFiles.slice(-1)[0];
        const filename = acceptedFile.name || ``;
        const extension = filename.split('.').pop()?.toLowerCase();
        if (extension !== undefined && extension !== 'md') {
            setTitle("file type is not supported");
            setVisible({
                ...state,
                value: "このファイルのプレビューを表示できません。拡張子が`md`のファイルのみ対応しています。"
            });
        }
        else {
            const text = await acceptedFile.text();
            setTitle(filename.split('.')[0]);
            setVisible({
                ...state,
                value: text
            });
        }
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const saveAsMd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        const filename = `${mdTitle || "untitled"}.md`;
        const file = new File(
            [state.value!],
            filename,
            { type: 'text/plain;charset=utf-8' }
        );
        saveAs(file);
    }

    return (
        <div data-color-mode='light'>
            <input
                type='text'
                value={mdTitle}
                className='title'
                placeholder="タイトル"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />

            <div {...getRootProps()}>
                <input
                    {...getInputProps()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log(e.target.value)}
                />
                <MDEditor
                    autoFocus
                    value={state.value}
                    previewOptions={{
                        linkTarget: '_blank',
                        remarkPlugins: [remarkMath],
                        rehypePlugins: [rehypeKatex]
                    }}
                    height={400}
                    highlightEnable={state.highlightEnable}
                    hideToolbar={!state.hideToolbar}
                    enableScroll={state.enableScroll}
                    visibleDragbar={state.visibleDragbar}
                    textareaProps={{
                        placeholder: "記事やレポートをMarkdown形式で記述してください",
                    }}
                    preview={state.preview}
                    onChange={(newValue = '') => {
                        setVisible({ ...state, value: newValue });
                    }}
                />
            </div>

            <div className='doc-tools'>
                <label>
                    <input
                        type='checkbox'
                        checked={state.visibleDragbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, visibleDragbar: e.target.checked });
                        }}
                    />
                    ドラッグバー
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.highlightEnable}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, highlightEnable: e.target.checked });
                        }}
                    />
                    ハイライト
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.enableScroll}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, enableScroll: e.target.checked });
                        }}
                    />
                    同時スクロール
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={state.hideToolbar}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setVisible({ ...state, hideToolbar: e.target.checked });
                        }}
                    />
                    ツールバー
                </label>
                <div className='save-button'>
                    <button
                        type='button'
                        disabled={!state.value}
                        style={{ marginLeft: 10 }}
                        onClick={saveAsMd}
                    >
                        Markdown形式で保存
                    </button>
                    <ReactToPrint
                        trigger={() => (
                            <button
                                type='button'
                                disabled={!state.value}
                                style={{ marginLeft: 10 }}
                            >
                                PDF形式にエクスポート
                            </button>
                        )}
                        content={() => pdfRef.current}
                        documentTitle={`${mdTitle || "untitled"}.pdf`}
                    />
                </div>
            </div>
            <br />

            <hr />
            <h3>PDF Preview</h3>
            <div ref={pdfRef}>
                {state.value && (
                    state.value.split('<br>').map((section) => <PdfPreview source={section} />)
                )}
            </div>
        </div>
    );
};

export default Editor;