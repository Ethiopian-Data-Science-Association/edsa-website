<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useMainStore } from '@/pinia/main';
import { useStore } from 'vuex';
import FormControlIcon from '@/components/FormControlIcon.vue';

const props = defineProps({
  name: { type: String, default: null },
  id: { type: String, default: null },
  autocomplete: { type: String, default: null },
  maxlength: { type: String, default: null },
  placeholder: { type: String, default: null },
  inputmode: { type: String, default: null },
  icon: { type: String, default: null },
  options: { type: Array, default: null },
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Number, Boolean, Array, Object], default: '' },
  documentStoragePath: { type: String, default: '', required: false },
  isReadOnly: { type: Boolean, default: false, required: false },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean,
});

const emit = defineEmits(['update:modelValue', 'setRef', 'file-upload-success', 'file-upload-error']);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const computedType = computed(() => (props.options ? 'select' : props.type));

const inputElClass = computed(() => {
  const base = [
    'px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
  ];

  if (props.icon) base.push('pl-10');

  return base;
});

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-12'));

const mainStore = useMainStore();
const store = useStore();

const selectEl = ref(null);
const textareaEl = ref(null);
const fileEl = ref(null);
const inputEl = ref(null);

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value);
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value);
  } else if (fileEl.value) {
    emit('setRef', fileEl.value);
  } else {
    emit('setRef', inputEl.value);
  }
});

const onFilePicked = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    emit('file-upload-error', 'No file selected.');
    return;
  }

  // Validate file type
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedFormats.includes(file.type)) {
    emit('file-upload-error', 'Unsupported file format. Only JPEG, JPG, PNG, and PDF are allowed.');
    return;
  }

  // Validate file size (max 200KB)
  const maxSizeInBytes = 200 * 1024; // 200KB
  if (file.size > maxSizeInBytes) {
    emit('file-upload-error', 'File size exceeds the limit of 200KB.');
    return;
  }

  // Upload file via shared module
  try {
    const metadata = { contentType: file.type.toString() };
    const uploadPath = `${props.documentStoragePath}${Date.now()}_${file.name}`; // Unique upload path
    await store.dispatch('shared/uploadDocument', {
      payload: {
        document: file,
        documentStoragePath: uploadPath,
        metadata,
      },
    }); 
    // Emit success event with the uploaded file path
    emit('file-upload-success');
  } catch (error) { // emit failed to upload event
    emit('file-upload-error', 'File upload failed. Please try again.');
  }
};

// Ctrl+K focus functionality
if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      inputEl.value?.focus();
    } else if (e.key === 'Escape') {
      inputEl.value?.blur();
    }
  };

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook);
      mainStore.isFieldFocusRegistered = true;
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook);
    mainStore.isFieldFocusRegistered = false;
  });
}
</script>

<template>
  <div class="relative">
    <select v-if="computedType === 'select'" :id="id" v-model="computedValue" :name="name" :class="inputElClass">
      <option v-for="option in options" :key="option.id ?? option" :value="option">
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea v-else-if="computedType === 'textarea'" :id="id" v-model="computedValue" :class="inputElClass"
      :name="name" :maxlength="maxlength" :placeholder="placeholder" :required="required" />
    <input v-else-if="computedType === 'file'" :id="id" ref="fileEl" :name="name" :type="computedType"
      :required="required" :placeholder="placeholder" :class="inputElClass" @change="onFilePicked" />
    <input v-else :id="id" ref="inputEl" v-model="computedValue" :name="name" :maxlength="maxlength"
      :inputmode="inputmode" :autocomplete="autocomplete" :required="required" :placeholder="placeholder"
      :type="computedType" :class="inputElClass" :readonly="isReadOnly"/>
    <FormControlIcon v-if="icon" :icon="icon" :h="controlIconH" />
  </div>
</template>
