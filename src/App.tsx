import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./App.css";
import Editor from "./components/Editor";
import headerImg from "./assets/header.png";

import { MarkdownStateProps, updateMarkdown } from "./slices/markdown-slice";

const App = () => {
  const dispatch = useDispatch();
  const markdownState = useSelector((state: { markdown: MarkdownStateProps }) => state.markdown);

  useEffect(() => {
    const fetchText = async () => {
      const path = "https://raw.githubusercontent.com/chonai-flora/marklive-pdf/main/README.md";
      const resp = await fetch(path);
      const newText = await resp.text();

      dispatch(updateMarkdown({
        title: "",
        text: newText,
      }));
    };

    if (!markdownState.text) {
      fetchText();
    }
  }, [dispatch, markdownState]);

  // eslint-disable-next-line
  const openVersionWebsite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target && e.target.value) {
      window.location.href = e.target.value;
    }
  };

  return (
    <div>
      <header className="header">
        <img src={headerImg} alt="header" />
      </header>

      <div className="warpper">
        <Editor />
      </div>

      <footer className="footer">
        <hr />
        Copyright (c) 2020 uiw<br />
        Released under the&nbsp;
        <a href="https://github.com/uiwjs/react-md-editor/blob/master/LICENSE">
          MIT license
        </a>
      </footer>
    </div>
  );
}

export default App;