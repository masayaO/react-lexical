import React, { useEffect, useState } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { EditorState, EditorThemeClasses } from "lexical";

const exampleTheme: EditorThemeClasses = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
};

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

interface OnChangePluginProps {
  onChange: (editorState: EditorState) => void;
}

// OnChangePluginコンポーネント
const OnChangePlugin: React.FC<OnChangePluginProps> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null; // このコンポーネントは何も表示しない
};

export function Editor() {
  const [editorStateJSON, setEditorStateJSON] = useState<EditorState>();

  function onChange(editorState: EditorState) {
    // toJSONを呼び出し、シリアライズ可能な文字列を生成
    // const serializedEditorState = editorState.toJSON();
    // JSON文字列に変換
    setEditorStateJSON(editorState);
  }
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
  };
  useEffect(() => {
    console.log(editorStateJSON);
  }, [editorStateJSON]);

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
