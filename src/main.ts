import './assets/main.css'

//PRIMEVUE
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css' // Iconos

//IMPORTS COMPONENTES PRIMEVUE
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import FloatLabel from 'primevue/floatlabel';
import DatePicker from 'primevue/datepicker';
import Chip from 'primevue/chip';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Password from 'primevue/password';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tooltip from 'primevue/tooltip';
import Popover from 'primevue/popover';



import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('MultiSelect', MultiSelect)
app.component('Textarea', Textarea)
app.component('FloatLabel', FloatLabel)
app.component('DatePicker', DatePicker)
app.component('Chip', Chip)
app.component('Card', Card)
app.component('Tag', Tag)
app.component('Password', Password)
app.component('Popover', Popover)
app.component('Tabs', Tabs)
app.component('TabList', TabList)
app.component('Tab', Tab)
app.component('TabPanels', TabPanels)
app.component('TabPanel', TabPanel)
app.directive('tooltip', Tooltip);

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: null,
          cssLayer: true
      }
  }
});

app.use(createPinia())
app.use(router)

app.mount('#app')
