<template>
  <div>
    <section
      v-if="editor"
      class="flex items-center flex-wrap gap-x-2 border-t border-l border-r border-gray-400 p-2"
    >
      <button
        type="button"
        class="p-1"
        :class="{ 'bg-gray-200 rounded': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatBold" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('italic') }"
        class="p-1"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatItalic" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('underline') }"
        class="p-1"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatUnderline" />
      </button>
      <button
        type="button"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 1 })
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatHeader1" />
      </button>
      <button
        type="button"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 2 })
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatHeader2" />
      </button>
      <button
        type="button"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 3 })
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatHeader3" />
      </button>
      <button
        type="button"
        :class="{
          'bg-gray-200 rounded': editor.isActive('heading', { level: 4 })
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatHeader4" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('bulletList') }"
        class="p-1"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatListBulleted" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('orderedList') }"
        class="p-1"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <TiptapMenubarIcon :icon="mdiOrderNumericAscending" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('blockquote') }"
        class="p-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <TiptapMenubarIcon :icon="mdiFormatQuoteOpen" />
      </button>
      <button
        type="button"
        :class="{ 'bg-gray-200 rounded': editor.isActive('code') }"
        class="p-1"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <TiptapMenubarIcon :icon="mdiCodeBraces" />
      </button>
      <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="p-1">
        <TiptapMenubarIcon :icon="mdiMinus" />
      </button>
      <button
        type="button"
        class="p-1 disabled:text-gray-400"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        <TiptapMenubarIcon :icon="mdiUndo" />
      </button>
      <button
        type="button"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="p-1 disabled:text-gray-400"
        @click="editor.chain().focus().redo().run()"
      >
        <TiptapMenubarIcon :icon="mdiRedo" />
      </button>
      <div class="control-group">
        <div class="button-group">
          <button class="p-1 disabled:text-gray-400" type="button"  @click="addImage">
            <TiptapMenubarIcon :icon="mdiImage" />
          </button>
        </div>
      </div>
    </section>
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TiptapMenubarIcon from './TiptapMenubarIcon.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import ImageResize from 'tiptap-extension-resize-image';

import {
  mdiMinus,
  mdiCodeBraces,
  mdiUndo,
  mdiRedo,
  mdiFormatQuoteOpen,
  mdiOrderNumericAscending,
  mdiFormatListBulleted,
  mdiFormatBold,
  mdiFormatHeader1,
  mdiFormatUnderline,
  mdiFormatItalic,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiImage
} from '@mdi/js'

const props = defineProps({
  modelValue: String
})

const store = useStore()

const emit = defineEmits(['update:modelValue'])


const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [StarterKit, Underline, Image, ImageResize],
  editorProps: {
    attributes: {
      class:
        'border text-gray-500 dark:text-slate-200 border-gray-400 p-4 min-h-[12rem] max-h-[12rem] overflow-y-auto outline-none prose max-w-none prose dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none max-w-full'
    }
  }
})

const addImage = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'

  fileInput.onchange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const metadata = { contentType: file.type.toString() }
      const uploadPath = `/blogs/${Date.now()}_${file.name}` // Unique upload path
      await store.dispatch('shared/uploadDocument', {
        payload: {
          document: file,
          documentStoragePath: uploadPath,
          metadata
        }
      })
      const imgPath = computed(() => store.getters['shared/documentPath']);
      editor.value.chain().focus().setImage({ src: imgPath.value }).run()
    }
  }

  fileInput.click()
}
</script>
