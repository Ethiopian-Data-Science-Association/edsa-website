<template>
    <LayoutAuthenticated>
      <SectionMain>
        <div class="max-w-4xl mx-auto my-8">
          <h1 class="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          <div class="space-y-6">
            <div v-for="(faq, index) in faqs" :key="index" class="border-b pb-4">
              <h2 class="text-2xl font-semibold">{{ faq.question }}</h2>
              <p class="text-gray-700 mt-2">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </SectionMain>
    </LayoutAuthenticated>
  </template>
  
  <script setup>
  const faqs = [
    {
      question: "What is the Ethiopian Data Science Association (EDSA)?",
      answer: "The Ethiopian Data Science Association (EDSA) is a professional body established in February 2024 to advance data science in Ethiopia by fostering professional stewardship and enhancing national problem-solving capabilities."
    },
    {
      question: "Who can become a member of EDSA?",
      answer: "Membership is open to individuals with qualifications in computer science, information systems, data science, statistics, mathematics, physics, software engineering, and related fields. Institutional and honorary memberships are also available."
    },
    {
      question: "What are the categories of membership in EDSA?",
      answer: "EDSA offers five membership categories: Founding Member, Regular Member, Institutional Member, Honorary Member, and Student Member, each with specific criteria and benefits."
    },
    {
      question: "What are the benefits of becoming a regular member of EDSA?",
      answer: "Regular members enjoy the right to vote, participate in decision-making, propose and elect committee members, access support for research and innovation projects, and contribute to the association’s activities."
    },
    {
      question: "How often does EDSA hold its General Assembly meetings?",
      answer: "The General Assembly of EDSA convenes annually. However, emergency meetings can be called when necessary by the chairman, president, or 20% of the regular and institutional members."
    },
    {
      question: "What is the fiscal year for EDSA?",
      answer: "The fiscal year for EDSA runs from July 1st to June 30th."
    },
    {
      question: "Can institutions join EDSA, and if so, what are their obligations?",
      answer: "Yes, institutions can join EDSA. They are expected to contribute to the association's activities, support community services, provide resources for seminars and training, and collaborate on research and innovation projects."
    },
    {
      question: "What happens if a member fails to pay their membership dues?",
      answer: "A regular member who fails to pay their dues may lose their right to vote in the General Assembly until the dues and any additional fines are paid."
    },
    {
      question: "How does EDSA support the professional development of its members?",
      answer: "EDSA organizes workshops, webinars, training programs, and networking opportunities to enhance the skills of its members and keep them informed of the latest trends in data science."
    },
    {
      question: "What are the procedures for terminating membership in EDSA?",
      answer: "Membership can be terminated for reasons such as non-payment of dues, involvement in activities that threaten the association, or a member's request to resign. The General Assembly makes the final decision on membership termination."
    }
  ]
  </script>
  
  <style scoped>
  h1 {
    color: #1a202c;
  }
  h2 {
    color: #2d3748;
  }
  </style>
  