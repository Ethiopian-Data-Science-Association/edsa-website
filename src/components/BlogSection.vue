<template>
    <div class="my-12">
      <h2 class="text-3xl font-bold text-center mb-8">Latest from our Blogs</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardBoxWidget
          v-for="(blog, index) in blogs"
          :key="index"
          :title="blog.title"
          :description="blog.description"
          :imageUrl="blog.image"
          :buttonUrl="blog.link"
          buttonColor="text-blue-500 dark:text-blue-400"
          buttonFontWeight="font-medium"
          buttonText="Read More"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import CardBoxWidget from './CardBoxWidget.vue';

  const blogs = [
    {
      title: "MongoDB Atlas Vector Search for RAG powered LLM Applications",
      description: "MongoDB Atlas Vector Search combines document databases with semantic search for smarter LLM applications.",
      image: "/public/favicon.png",  // Replace with actual image paths
      link: "/blog/mongodb-atlas-vector-search"
    },
    {
      title: "A Hands-on Guide on CometLLM for LLM Explainability",
      description: "CometLLM enhances LLM explainability through prompt logging, tracking, and visualization, facilitating transparency and reproducibility in AI development.",
      image: "/public/favicon.png",
      link: "/blog/cometllm-guide"
    },
    {
      title: "Why do Enterprises Love RAG?",
      description: "Learn how RAG can transform the enterprise operations and give you a competitive edge in today's data-driven landscape.",
      image: "/public/favicon.png",
      link: "/blog/enterprises-love-rag"
    },
    {
      title: "Blog Title 4",
      description: "Brief description for blog 4.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-4"
    },
    {
      title: "Blog Title 5",
      description: "Brief description for blog 5.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-5"
    },
    {
      title: "Blog Title 6",
      description: "Brief description for blog 6.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-6"
    },
    {
      title: "Blog Title 7",
      description: "Brief description for blog 7.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-7"
    },
    {
      title: "Blog Title 8",
      description: "Brief description for blog 8.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-8"
    },
    {
      title: "Blog Title 9",
      description: "Brief description for blog 9.",
      image: "/public/favicon.png",
      link: "/blog/blog-title-9"
    }
  ]
  </script>
  
  <style scoped>
  /* Additional styles if necessary */
  </style>
  