<script setup>
import { mdiInformation, mdiAccountGroup, mdiBriefcase } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import TableSampleClients from '@/components/TableMembers.vue'

</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitle>About Us</SectionTitle>


            <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <!-- Main Content -->
                <div class="col-span-2">
                    <CardBox>
                        <div class="p-6">
                            <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
                            <p class="mb-6">
                                Founded in February 2024, the Ethiopian Data Science Association (EDSA) was established
                                in response to the rapid growth of data science as a pivotal force in today's digital
                                world. As the field continues to evolve with advances in artificial intelligence and
                                other 21st-century technologies, EDSA is dedicated to guiding Ethiopia's journey into a
                                future shaped by data-driven decision-making and innovation. Our association serves as a
                                unifying platform for professionals and enthusiasts, fostering collaboration and
                                elevating Ethiopia's data science capabilities to global standards.
                            </p>

                            <h2 class="text-2xl font-semibold mb-4">Our Purpose</h2>
                            <p class="mb-6">
                                EDSA is committed to consolidating and enhancing the fragmented landscape of data
                                science in Ethiopia. We aim to bring together scholars, researchers, and practitioners
                                under one umbrella, driving forward impactful research and technological innovation. Our
                                initiatives focus on ensuring that data science plays a significant role in Ethiopia's
                                economic and social development. Through partnerships, professional development, and
                                advocacy, we work tirelessly to integrate data science into the national agenda,
                                promoting best practices and ethical standards that resonate both locally and globally.
                            </p>

                            <h2 class="text-2xl font-semibold mb-4">Membership</h2>
                            <p>
                                EDSA offers inclusive membership categories, welcoming founding members, professionals,
                                institutions, honorary members, and students. We strive to build a vibrant community
                                that empowers members to exchange knowledge, enhance skills, and contribute to the
                                advancement of data science in Ethiopia. Whether you're an experienced expert or a
                                passionate learner, EDSA provides the resources, connections, and opportunities to
                                support your journey in the data science field. Together, we are building a stronger,
                                more innovative future for Ethiopia.
                            </p>
                        </div>
                    </CardBox>

            <SectionTitle>Founding Members List</SectionTitle>
                    <CardBox class="mb-6" has-table>
                        <TableSampleClients checkable />
                    </CardBox>
                </div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style scoped>
/* Additional styles if necessary */
</style>
