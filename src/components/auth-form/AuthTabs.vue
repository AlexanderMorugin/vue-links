<template>
  <Tabs v-model:value="activeTab">
    <TabList>
      <Tab value="signin">Вход</Tab>
      <Tab value="signup">Регистрация</Tab>
    </TabList>
    <TabPanels v-if="activeTab === 'signin' || activeTab === 'signup'">
      <TabPanel value="signin"><LoginForm @resetPassword="activeTab = 'reset'" /></TabPanel>
      <TabPanel value="signup"><RegisterForm /></TabPanel>
    </TabPanels>
    <TabPanels v-if="activeTab === 'reset'">
      <TabPanel value="reset"><ResetPasswordForm /></TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ResetPasswordForm from './ResetPasswordForm.vue'

const activeTab = ref('signin')

// const resetPassword = () => {}
</script>
