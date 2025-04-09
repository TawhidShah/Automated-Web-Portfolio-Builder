"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import sanitizeHtml from "sanitize-html";

const DEFAULT_COLOR = "#f8fafc";

const RTEditor = ({ name, setValue, defaultValue }) => {
  const [color, setColor] = useState(DEFAULT_COLOR);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Bold,
      Italic,
      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[6rem]",
      },
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      const dirtyHtml = editor.getHTML();
      const cleanHtml = sanitizeHtml(dirtyHtml, {
        allowedTags: ["strong", "em", "u", "p", "span"],
        allowedAttributes: {
          span: ["style"],
        },
      });
      // If the editor is empty (only contains a paragraph tag with no content), set the value to an empty string
      if (cleanHtml === "<p></p>") {
        setValue(name, "");
        return;
      }
      setValue(name, cleanHtml);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col rounded-md border p-2">
      <div className="mb-2 flex space-x-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${editor.isActive("bold") ? "rounded-md border-2 border-gray-600" : ""}`}
        >
          <BoldIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${editor.isActive("italic") ? "rounded-md border-2 border-gray-600" : ""}`}
        >
          <ItalicIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 ${editor.isActive("underline") ? "rounded-md border-2 border-gray-600" : ""}`}
        >
          <UnderlineIcon />
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 rounded-md border-2 border-gray-600 p-2">
            <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: color }}></div>
          </button>
          <input
            type="color"
            id="colorPicker"
            value={color}
            onChange={(e) => {
              const selectedColor = e.target.value;
              setColor(selectedColor);
              editor.chain().focus().setColor(selectedColor).run();
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <button
          onClick={() => {
            setColor(DEFAULT_COLOR);
            editor.chain().focus().unsetColor().run();
          }}
          className="rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
        >
          Reset Color
        </button>
      </div>
      <EditorContent editor={editor} className="rounded-lg border p-2" />
    </div>
  );
};

export default RTEditor;
