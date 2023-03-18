import React, { useRef, useState, useEffect } from 'react';
import 'katex/dist/katex.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { saveAs } from 'file-saver';
import ReactToPrint from 'react-to-print';
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
            const path = "https://raw.githubusercontent.com/chonai-flora/md-editor-with-pdf-generator/main/README.md";
            const resp = await fetch(path);
            const text = await resp.text();
            setVisible({ ...state, value: text });
        }
        fetchReadme();
    }, []);

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
                    state.value!.split('<br>')
                        .map((section) => <PdfPreview source={section} />))}
            </div >
        </div >
    );
};

export default Editor;