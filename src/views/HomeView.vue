<script setup>
import { ref, onMounted } from 'vue'
import {
  mdiChartTimelineVariant,
  mdiGithub,
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import ObjectivesSection from '@/components/ObjectivesSection.vue'
import BlogSection from '@/components/BlogSection.vue'
import ContactUs from '@/components/ContactUs.vue'

const chartData = ref(null)

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}

onMounted(() => {
  fillChartData()
})

</script>

<template>
  <LayoutAuthenticated>
    <!-- Video Introduction Section -->
    <div class="relative bg-slate-900 text-white p-6 mb-6">
      <!-- Video Element with Increased Height -->
      <div class="absolute inset-0 z-0">
        <video autoplay loop muted playsinline class="w-full h-full object-cover" style="height: 600px;">
          <source src="/data-sources/Intro-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <!-- Text Overlay -->
      <div class="relative z-10 text-left">
        <h2 class="text-4xl font-extrabold mb-4">EDSA AI Academy</h2>
        <h2 class="text-3xl font-semibold mb-4">Enhance Your AI Skills with our Hands-on training</h2>

        <h2 class="text-xl font-normal mb-4 lg:pt-64">
          Stand out from the crowd by mastering AI today—your future success depends on staying ahead in the game.
        </h2>
        <h2 class="text-xl font-bold text-green-500 mb-6">
          Start transforming your skills with our Generative AI courses—enroll now and future-proof your career!
        </h2>

        <!-- Responsive Buttons -->
        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <a href="/edsa-website/memberships"
            class="px-6 py-3 border-2 border-green-500 text-green-500 font-bold rounded-full hover:bg-green-500 hover:text-white transition text-center">
            BECOME A MEMBER
          </a>
          <a href="/edsa-website/certifications"
            class="px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition text-center">
            START LEARNING AI
          </a>
        </div>
      </div>
    </div>

    <!-- Ensure SectionMain Starts Below the Video Section -->
    <SectionMain class="mt-[150px] xs:mt-80 sm:mt-80 md:mt-80 lg:mt-40">
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Objectives" main>
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget title="Fostering Collaboration"
          description="Share expertise, address industry challenges collectively, and foster meaningful partnerships by networking and exchanging contacts."
          imageUrl="/public/favicon.png" linkText="Learn more" linkUrl="/"
          linkColor="text-purple-600 dark:text-purple-400" linkFontWeight="font-medium" />
        <CardBoxWidget title="Research and Development"
          description="We aim to offer crucial professional support and essential resources to students pursuing data science."
          imageUrl="/public/favicon.png" linkText="Learn more" linkUrl="/"
          linkColor="text-purple-600 dark:text-purple-400" linkFontWeight="font-medium" />

        <CardBoxWidget title="Education and Training"
          description="We offer variety of certifications, workshops, webinars, and training programs. Check out our Certifications page."
          imageUrl="/public/favicon.png" linkText="Learn more" linkUrl="/"
          linkColor="text-purple-600 dark:text-purple-400" linkFontWeight="font-medium" />
      </div>

      <!-- Objectives Section here -->
      <ObjectivesSection />

      <!-- Blog Section -->
      <BlogSection />

      <!-- Contact Us section -->
      <ContactUs />
    </SectionMain>
  </LayoutAuthenticated>
</template>
