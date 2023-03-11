// import Vue from 'vue'
import {createApp} from 'vue'
import App from './components/App.vue'
// import messages from '../../locales'
// import { createI18n } from 'vue-i18n'

// const i18n = createI18n({
//     locale: 'en',
//     messages,
// })

const app = joinContent(App)
// app.use(i18n)
app.mount('#joinContentApp')

function joinContent(element) {
    const div = document.createElement('div')
    div.id = 'joinContentApp'
    document.body.appendChild(div)
    return createApp(element)
}


