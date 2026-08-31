"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconCode,
  IconLink,
  IconPhoto,
  IconMinus,
  IconHeading,
} from "@tabler/icons-react";

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded p-1.5 transition-colors ${
        active
          ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Write your post content here...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline dark:text-blue-400" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] px-4 py-3 font-body text-neutral-900 dark:text-neutral-100 focus:outline-none prose-headings:font-heading prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-lg dark:prose-invert",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[300px] rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900">
        Loading editor...
      </div>
    );
  }

  function addLink() {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  const iconSize = 16;

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-800">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading"
        >
          <IconHeading size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <IconBold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <IconItalic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <IconCode size={iconSize} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-600" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <IconList size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <IconListNumbers size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <IconBlockquote size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <IconMinus size={iconSize} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-600" />

        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Add Link">
          <IconLink size={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          <IconPhoto size={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="bg-white dark:bg-neutral-900"
      />
    </div>
  );
}
