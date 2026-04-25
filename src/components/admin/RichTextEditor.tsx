'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { forwardRef, useImperativeHandle } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { 
    Bold, Italic, Underline as UnderlineIcon, 
    List, ListOrdered, Quote, Link as LinkIcon, 
    Image as ImageIcon, Code, Heading1, Heading2, 
    Undo, Redo, Eraser
} from 'lucide-react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageClick?: () => void;
}

const RichTextEditor = forwardRef(({ content, onChange, onImageClick }: RichTextEditorProps, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image.configure({ inline: true, HTMLAttributes: { class: 'editor-image' } }),
            Placeholder.configure({ placeholder: 'Start writing your story...' })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useImperativeHandle(ref, () => ({
        insertImage: (url: string) => {
            if (editor) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    }));

    if (!editor) return null;

    const MenuButton = ({ onClick, isActive, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`${styles.menuButton} ${isActive ? styles.active : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className={styles.editorWrapper}>
            <div className={styles.toolbar}>
                <div className={styles.toolGroup}>
                    <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon size={16} /></MenuButton>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="H1"><Heading1 size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 size={16} /></MenuButton>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote"><Quote size={16} /></MenuButton>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <MenuButton 
                        onClick={() => {
                            const url = prompt('Enter URL');
                            if (url) editor.chain().focus().setLink({ href: url }).run();
                        }} 
                        isActive={editor.isActive('link')}
                        title="Link"
                    >
                        <LinkIcon size={16} />
                    </MenuButton>
                    <MenuButton onClick={onImageClick} title="Image Library"><ImageIcon size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block"><Code size={16} /></MenuButton>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={16} /></MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={16} /></MenuButton>
                </div>
            </div>

            <EditorContent editor={editor} className={styles.content} />
        </div>
    );
});

export default RichTextEditor;
