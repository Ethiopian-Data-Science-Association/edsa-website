<template>
    <LayoutAuthenticated>
      <div class="flex flex-col min-h-screen">
        <!-- Main Content -->
        <SectionMain class="flex-grow">
          <!-- Header with Title and Button -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold">Library / Resources</h2>
            <BaseButton 
              v-if="isAdmin"
              label="Add Resource" 
              :icon="mdiPlus" 
              color="success"
              class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12" 
              @click="goToCreatePage" 
            />
          </div>
  
          <!-- Category Filter Pills -->
          <div class="flex justify-center mb-6 space-x-4">
            <PillTag
              v-for="category in categories"
              :key="category"
              :label="category"
              :color="selectedCategory === category ? 'info' : 'lightDark'"
              :outline="selectedCategory !== category"
              @click="toggleCategory(category)"
            />
          </div>
  
          <!-- Resources Grid or Empty State -->
          <div v-if="filteredResources.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardBox
              v-for="resource in filteredResources"
              :key="resource.id"
              class="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardBoxComponentTitle :title="resource.title">
                <BaseButton :icon="mdiOpenInNew" color="whiteDark" small rounded-full />
              </CardBoxComponentTitle>
  
              <p class="text-gray-500 mb-4">{{ resource.description }}</p>
  
              <!-- PDF Download -->
              <div v-if="resource.type === 'pdf'" class="flex justify-center">
                <a
                  :href="resource.url"
                  download
                  class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Download PDF
                </a>
              </div>
  
              <!-- HTML Content Preview -->
              <div v-if="resource.type === 'html'" class="text-sm bg-gray-50 border rounded p-3">
                <div v-html="resource.content"></div>
              </div>
            </CardBox>
          </div>
  
          <!-- Empty State -->
          <div v-else class="flex flex-col items-center text-center py-16">
            <img src="/public/favicon.png" alt="No resources available" class="w-24 h-24 mb-4" />
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No resources available</p>
            <p class="text-gray-500 dark:text-gray-400">Check back later or add a new resource.</p>
            <BaseButton
              v-if="isAdmin"
              label="Add Resource"
              :icon="mdiPlus"
              color="success"
              class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600"
              @click="goToCreatePage"
            />
          </div>
        </SectionMain>
      </div>
    </LayoutAuthenticated>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionMain from "@/components/SectionMain.vue";
  import CardBox from "@/components/CardBox.vue";
  import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import PillTag from "@/components/PillTag.vue";
  import { mdiPlus, mdiOpenInNew } from "@mdi/js";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const isAdmin = true; // Assume admin status for demonstration
  const selectedCategory = ref("All");
  const categories = ref(["All", "Research", "Technology", "Education"]);
  
  const resources = ref([
    {
      id: 1,
      title: "Academic Paper",
      description: "An in-depth analysis of AI.",
      type: "pdf",
      url: "https://example.com/academic-paper.pdf",
      category: "Research",
    },
    {
      id: 2,
      title: "White Paper",
      description: "Blockchain technology overview.",
      type: "html",
      content: "<p>This is a white paper summary...</p>",
      category: "Technology",
    },
    {
      id: 3,
      title: "External Course",
      description: "Mastering Vue.js 3.",
      type: "pdf",
      url: "https://example.com/vue-course.pdf",
      category: "Education",
    },
  ]);
  
  const filteredResources = computed(() =>
    selectedCategory.value === "All"
      ? resources.value
      : resources.value.filter((resource) => resource.category === selectedCategory.value)
  );
  
  const toggleCategory = (category) => {
    selectedCategory.value = category;
  };
  
  const goToCreatePage = () => {
    router.push("/library-create-form");
  };
  </script>
  
  <style scoped>
  .min-h-screen {
    min-height: 100vh;
  }
  
  .bg-green-500 {
    background-color: #10b981;
  }
  
  .hover\:bg-green-600:hover {
    background-color: #059669;
  }
  
  .bg-blue-500 {
    background-color: #3b82f6;
  }
  
  .hover\:bg-blue-600:hover {
    background-color: #2563eb;
  }
  </style>
  