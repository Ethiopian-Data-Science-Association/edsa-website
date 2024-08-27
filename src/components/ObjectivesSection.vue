<template>
    <div class="my-12">
      <div v-for="(objective, index) in objectives" :key="index" class="flex flex-col lg:flex-row items-start mb-12">
        <!-- Description Section -->
        <div :class="index % 2 === 0 ? 'order-2 lg:order-1' : 'order-1 lg:order-2'" class="lg:w-1/2 p-4 lg:mr-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ objective.title }}</h2>
          <p class="text-gray-600 dark:text-slate-400">{{ objective.description }}</p>
        </div>
  
        <!-- Image Section -->
        <div :class="index % 2 === 0 ? 'order-1 lg:order-2 sm:order-3' : 'order-2 lg:order-1 sm:order-3'" class="lg:w-1/3 p-4 lg:ml-4">
          <img :src="objective.image" alt="Objective Image" class="rounded-lg w-full h-auto object-cover sm:max-w-xs md:max-w-sm lg:max-w-md" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const objectives = [
    {
      title: "Fostering Collaboration",
      description: "Join a vibrant community where data science professionals unite to tackle industry challenges, share knowledge, and build meaningful partnerships. Through networking and collaboration, you'll drive innovation and collective success, empowering the entire community to achieve greater heights in data science.",
      image: "/public/favicon.png"
    },
    {
      title: "Advancing Research and Development",
      description: "We spearhead research initiatives tailored to Ethiopia, bridging global advancements in data science with local innovation. Our goal is to support groundbreaking projects that elevate Ethiopia’s standing in data science, fostering local expertise and contributing to the global data science community.",
      image: "/public/favicon.png"
    },
    {
      title: "Education and Training",
      description: "Empower yourself with cutting-edge data science skills through our workshops, webinars, and training programs. We are committed to enhancing professional development and community knowledge, ensuring that both our members and the broader audience in Ethiopia have access to high-quality educational resources.",
      image: "/public/favicon.png"
    },
    {
      title: "Advocacy",
      description: "We champion ethical practices, data privacy, and responsible data science usage. By actively engaging with policymakers, we shape the future of technology to ensure it serves the greater good, protecting public interest while promoting the responsible and beneficial application of data science across sectors.",
      image: "/public/favicon.png"
    },
    {
      title: "Communication",
      description: "We serve as the primary gateway for external entities to access our expertise, services, and insights. Through transparent communication and collaboration, we drive joint efforts in technological advancements, building strong partnerships that advance the field of data science both locally and globally.",
      image: "/public/favicon.png"
    },
    {
      title: "Library",
      description: "Our Library offers professional support to researchers, ensuring their work is accessible and preserved. We curate valuable open-source projects and datasets, providing a resource-rich environment that empowers the data science community with the tools needed to succeed in their research and innovation efforts.",
      image: "/public/favicon.png"
    },
    {
      title: "Outsourcing",
      description: "We connect companies with expert data analytics and engineering services. Our outsourcing wing offers members practical, hands-on experience while delivering tailored solutions to meet corporate needs, fostering professional development and delivering high-quality services that drive business success.",
      image: "/public/favicon.png"
    }
  ]
  </script> 
  