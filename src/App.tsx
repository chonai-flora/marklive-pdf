import "./App.css";
import Editor from "./components/Editor";
import headerImg from "./assets/header.png";

const App = () => {
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
        Copyright (c) 2020 uiw (&nbsp;
        <a href="https://github.com/uiwjs/react-md-editor/blob/master/LICENSE">
          license
        </a>
        &nbsp;)
      </footer>
    </div>
  );
}

export default App;


/*
```
src/
  |-components/
    |-Editor.tsx

README.md
```

*/