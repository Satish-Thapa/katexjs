/* eslint-disable react/jsx-no-undef */
import { useEffect, useRef, useState } from "react";
import Editor from "@draft-js-plugins/editor";
import { convertFromRaw, convertToRaw, EditorState, Modifier } from "draft-js";
// @ts-ignore
import createKaTeXPlugin from "draft-js-katex-plugin";

import createMathjaxPlugin from "draft-js-mathjax-plugin";

import createToolbarPlugin, {
  Separator,
} from "@draft-js-plugins/static-toolbar";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  SubButton,
  SupButton,
} from "@draft-js-plugins/buttons";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "katex/dist/katex.min.css";
import { Controller } from "react-hook-form";

interface DraftEditorProps {
  name: string;
  control: any;
  label?: string;
}

import katex from "katex";
import "./App.css";

const MyEditor = () => {
  const [showToolbar, setshowToolbar] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );

  const editor = useRef<Editor | null>(null);
  let mathkatex:any;


  const [{ plugins, Toolbar, InsertButton }]: any = useState(() => {
    const toolbarPlugin = createToolbarPlugin();
    const katexPlugin = createKaTeXPlugin({
      katex, // the katex object or a wrapper defining render() and __parse().
      doneContent: {
        valid: "Update the katex",
        invalid: "Invalid TeX found",
      },
      insertContent: "∑",
      MathInput: null, // Sett to the MathInput element to use MathInput
      removeContent: "Remove",
      translator: null,
    });

    const { Toolbar } = toolbarPlugin;





    const plugins =  [toolbarPlugin, katexPlugin] 
    const { InsertButton } = katexPlugin;

    return {
      plugins,
      Toolbar,
      InsertButton,
    };
  });

  const insertMath = (editorState:EditorState) => {
    if (editorState) {
      const selection = editorState.getSelection();
      let contentState = editorState.getCurrentContent();
      contentState = contentState.createEntity("INLINETEX", "IMMUTABLE", {
        teX: "\\int_a^bf(x)dx", //default
        displaystyle: true,
      });
      const entityKey = contentState.getLastCreatedEntityKey();
      console.log(entityKey);
      contentState = Modifier.insertText(
        contentState,
        selection,
        "\t\t",
        undefined,
        entityKey
      );

      setEditorState(
        EditorState.push(editorState, contentState, "apply-entity")
      );
    }
  };

  return (
    <div>
      <Toolbar>
        {(externalProps: any) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator {...externalProps} />
            <SupButton {...externalProps} />
            <SubButton {...externalProps} />
            <Separator {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <Separator {...externalProps} />
            <InsertButton initialValue={"x^2"} {...externalProps} />
            <button onClick={() => insertMath(editorState)}>
              Add integral
            </button>
          </>
        )}
      </Toolbar>
      <Editor
        customStyleMap={{
          SUBSCRIPT: { fontSize: "0.6em", verticalAlign: "sub" },
          SUPERSCRIPT: { fontSize: "0.6em", verticalAlign: "super" },
        }}
        onBlur={(event: any) => {
          event?.relatedTarget?.className !==
            "draftJsKatexPlugin__insertButton__2uR4O" && setshowToolbar(false);
        }}
        onFocus={() => setshowToolbar(true)}
        editorState={editorState}
        onChange={(newEditorState: EditorState) => {
          // const contentState = newEditorState.getCurrentContent();
          // const contentRaw = convertToRaw(contentState);
          // const contentString = JSON.stringify(contentRaw);
          // console.log(contentString);
          setEditorState(newEditorState);
        }}
        ref={(element) => {
          editor.current = element;
        }}
        plugins={plugins}

      />
    </div>
  );
};

export default MyEditor;
