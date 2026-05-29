// "use client";
// import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
// // import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
// import StarterKit from "@tiptap/starter-kit";
// import { BoldIcon, CodeIcon, HighlighterIcon, ItalicIcon, ListIcon, ListOrderedIcon, Quote, StrikethroughIcon, UnderlineIcon } from "lucide-react";
// import { Toggle } from "./ui/toggle";
// import Highlight from '@tiptap/extension-highlight'
// import { Editor } from "@tiptap/react";

// const Tiptap = () => {
//   const editor = useEditor({
//     extensions: [StarterKit, Highlight.configure({multicolor: true})], // define your extension array
//     content: "<p>Hello World!</p>", // initial content
//     editorProps: {
//         attributes: {
//             class: "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none"
//         },
//     },
//     immediatelyRender: false,
//   });

//   return (
//     <>
//       {editor && <ToolBar editor={editor} />}
//       <EditorContent editor={editor} />
//       {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu> */}
//       {/* <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
//     </>
//   );
// };

// export default Tiptap;

// // we copy this code form https://tiptap.dev/docs/editor/getting-started/install/nextjs this link ( Integrate Tiptap )
// // for this first of all we have run this install command on terminal ( npm install @tiptap/react @tiptap/pm @tiptap/starter-kit )

// const ToolBar = ({ editor }: { editor: Editor }) => {
//   const editorState = useEditorState({
//     editor,
//     selector: (ctx) => {
//       return {
//         isBold: ctx.editor.isActive("bold") ?? false,
//         isItalic: ctx.editor.isActive("italic") ?? false,
//         isUnderline: ctx.editor.isActive("underline") ?? false,
//         isStrike: ctx.editor.isActive("strike") ?? false,
//         isHighlight: ctx.editor.isActive("highlight") ?? false,
//         isCode: ctx.editor.isActive("code") ?? false,
//         isBulletList: ctx.editor.isActive("bulletList") ?? false,
//         isOrderedList: ctx.editor.isActive("orderedList") ?? false,
//         isBlockquote: ctx.editor.isActive("blockquote") ?? false,
//       };
//     },
//   });
//   return (
//     <div>
//       <Toggle
//         size="sm"
//         pressed={editorState.isBold}
//         onPressedChange={() => editor.chain().focus().toggleBold().run()}
//         aria-label="Toggle bold"
//       >
//         <BoldIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isItalic}
//         onPressedChange={() => editor.chain().focus().toggleItalic().run()}
//         aria-label="Toggle italic"
//       >
//         <ItalicIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isUnderline}
//         onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
//         aria-label="Toggle italic"
//       >
//         <UnderlineIcon className="w-4 h-4" />
//       </Toggle>

//        <Toggle
//         size="sm"
//         pressed={editorState.isStrike}
//         onPressedChange={() => editor.chain().focus().toggleStrike().run()}
//         aria-label="Toggle strike"
//       >
//         <StrikethroughIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isHighlight}
//         onPressedChange={() => editor.chain().focus().toggleHighlight({color: "#fdeb80" }).run()}
//         aria-label="Toggle highlight"
//       >
//         <HighlighterIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isCode}
//         onPressedChange={() => editor.chain().focus().toggleCode().run()}
//         aria-label="Toggle code"
//       >
//         <CodeIcon className="w-4 h-4" />
//       </Toggle>

//        <Toggle
//         size="sm"
//         pressed={editorState.isBulletList}
//         onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
//         aria-label="Toggle bulletList"
//       >
//         <ListIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isOrderedList}
//         onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
//         aria-label="Toggle orderedList"
//       >
//         <ListOrderedIcon className="w-4 h-4" />
//       </Toggle>

//       <Toggle
//         size="sm"
//         pressed={editorState.isBlockquote}
//         onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
//         aria-label="Toggle blockquote"
//       >
//         <Quote className="w-4 h-4" />
//       </Toggle>
//     </div>
//   );
// };







"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
// import Underline from "@tiptap/extension-underline";
import {
  BoldIcon,
  CodeIcon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Quote,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
  UnlinkIcon,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Editor } from "@tiptap/react";
import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BubbleMenu as TiptapBubbleMenu} from "@tiptap/react/menus";

// 1. Move extensions outside to prevent "Duplicate extension" warnings on re-render
const extensions = [
  StarterKit.configure({
    // Ensure lists and blockquotes are enabled (they are by default in StarterKit)
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Highlight.configure({ multicolor: true }),
//   Underline,
];

const Tiptap = ({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions,
    // content: `<p>Hello World!</p>`, // initial content
    editorProps: {
      attributes: {
        // class:
        //   "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none border p-4 rounded-md min-h-[150px] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic",
        class:
          "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none",
  //       class:
  // "prose dark:prose-invert prose-sm max-w-none focus:outline-none " +
  // "[&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 " +
  // "[&_h1]:my-2 [&_h2]:my-2 [&_h3]:my-2",
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    // <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-sm bg-white">
    <div className="bg-background relative rounded-lg border shadow-sm">
      {editor && (
        <div>
        <ToolBar editor={editor} />
        <BubbleMenu editor={editor}/>
        </div>
        )
        }
      <div className="mt-4">
        <EditorContent editor={editor} className="min-h-[300px] px-4 py-3" />
      </div>
    </div>
  );
};

export default Tiptap;

// * ---------------- * ----------------- //
// --------- Link ------------------------------------
// * ---------------- * ----------------- //

function LinkComponent({
  editor,
  children,
}: {
  editor: Editor;
  children: ReactNode;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      {/* this is the main */}
      {/* trigger point */}
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>
          <Input
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetLink();
              }
            }}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsLinkPopoverOpen(false)}
            >
              Cancle
            </Button>
            <Button onClick={handleSetLink}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// * ---------------- * ----------------- //


const ToolBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isHighlight: ctx.editor.isActive("highlight"),
      isCode: ctx.editor.isActive("code"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isLink: ctx.editor.isActive("link"),
      canRedo: editor.can().redo(),
      canUndo: editor.can().undo(),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isHeading3: ctx.editor.isActive("heading", { level: 3 }),
      isHeading4: ctx.editor.isActive("heading", { level: 4 }),
      isHeading5: ctx.editor.isActive("heading", { level: 5 }),
      isHeading6: ctx.editor.isActive("heading", { level: 6 }),
      isParagraph: ctx.editor.isActive("paragraph"),
    }),
  });

// * ---------------- * ----------------- //
// ----- Heading H1, H2, H3, H4, H5, H6, P, ---------
// * ---------------- * ----------------- //
  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value.replace("heading", "")) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  // ------------------------------------------------ //

    if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-0 bg-gray-100 p-1 rounded-md border-b">
      <Select
        onValueChange={handleHeadingChange}
        value={
          editorState.isHeading2
            ? "heading2"
            : editorState.isHeading3
              ? "heading3"
              : editorState.isHeading4
                ? "heading4"
                : editorState.isHeading5
                  ? "heading5"
                  : editorState.isHeading6
                    ? "heading6"
                    : "paragraph"
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Paragraph" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Paragraph</SelectItem>
          <SelectItem value="heading2">Heading 1</SelectItem>
          <SelectItem value="heading3">Heading 2</SelectItem>
          <SelectItem value="heading4">Heading 3</SelectItem>
          <SelectItem value="heading5">Heading 4</SelectItem>
          <SelectItem value="heading6">Heading 5</SelectItem>
        </SelectContent>
      </Select>

      <Toggle
        size="sm"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isHighlight}
        onPressedChange={() =>
          editor.chain().focus().toggleHighlight({ color: "#fdeb80" }).run()
        }
      >
        <HighlighterIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="w-4 h-4" />
      </Toggle>

      <div className="bg-border mx-1 h-8 w-px" />

      {editorState.isLink ? (
        <Toggle
          pressed
          onPressedChange={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <UnlinkIcon className="w-4 h-4" />
        </Toggle>
      ) : (
        <LinkComponent editor={editor}>
          <Toggle size="sm" aria-label="Toggle link">
            <LinkIcon className="w-4 h-4" />
          </Toggle>
        </LinkComponent>
      )}
      <div className="bg-border mx-1 h-8 w-px" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        aria-label="Undo"
      >
        <UndoIcon className="w-4 h-4" />
      </Button>

      <div className="bg-border mx-1 h-8 w-px" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        aria-label="Redo"
      >
        <RedoIcon className="w-4 h-4" />
      </Button>

      <div className="bg-border mx-1 h-8 w-px" />
    </div>
  );
};

// -------------------------------------------------------------------------------------\

export function BubbleMenu({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        isUnderline: ctx.editor.isActive("underline") ?? false,
        isHighlight: ctx.editor.isActive("highlight") ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
      };
    },
  });

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bg-background flex items-center rounded-md border shadow-md relative z-200"
    >
      <Toggle
        size="sm"
        pressed={editorState.isBold}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isItalic}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle bold"
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isUnderline}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isStrike}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isHighlight}
        onPressedChange={() =>
          editor.chain().focus().toggleHighlight({ color: "#fdeb80" }).run()
        }
        aria-label="Toggle highlight"
      >
        <HighlighterIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isCode}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
      <div className="bg-border mx-1 h-6 w-px" />

      <Toggle
        size="sm"
        pressed={editorState.isBulletList}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editorState.isBlockquote}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="bg-border mx-1 h-6 w-px" />

      {editorState.isLink ? (
        <Toggle
          pressed
          onPressedChange={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <UnlinkIcon className="h-4 w-4" />
        </Toggle>
      ) : (
        <LinkComponent editor={editor}>
          <Toggle size="sm" aria-label="Toggle link">
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
      )}
    </TiptapBubbleMenu>
  );
}



