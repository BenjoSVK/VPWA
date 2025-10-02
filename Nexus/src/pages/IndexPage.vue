<template>
  <q-page>
    <nav class="bg-glass row justify-center items-center">
      <div class="limited-width row justify-between items-center">
        <div class="row items-center">
          <div
            style="width: 32px; height: 32px"
            class="row items-center justify-center bg-gradient-secondary border-rad"
          >
            <img src="~assets/Icon.svg" alt="Icon" width="20px" height="20px" />
          </div>
          <p class="text-dark text-h6 q-ma-none q-ml-sm q-mr-md">Nexus</p>
          <div style="background-color: #eceef2" class="row items-center border-rad">
            <p class="q-ma-none q-mx-sm text-dark">IRC Chat</p>
          </div>
        </div>
        <div class="row items-center">
          <IndexButton variant="ghost" text="Documentation" @click="handleDocumentation" />
          <IndexButton
            variant="primary"
            text="GitHub"
            :icon="GithubSvg"
            @click="handleGithub"
            class="q-ml-md"
          />
        </div>
      </div>
    </nav>
    <body>
      <div class="q-mx-xl header-container">
        <div class="row justify-center items-center column text-center">
          <IndexButton
            class="q-mb-md"
            variant="outline"
            text="Vue 3 + Quasar + AdonisJS"
            :icon="BoltSvg"
          />
          <h1 class="text-h2 q-mb-md header">Moderné IRC chatovanie pre váš tím</h1>
          <h2 class="text-h5 text-weight-thin q-mb-md">
            Nexus je minimalistická a výkonná chatovacia aplikácia inšpirovaná Slack-om. Vytvorená s
            Vue 3, Quasar frameworkom a AdonisJS backend-om pre seamless zážitok.
          </h2>
          <div class="row justify-center items-center">
            <IndexButton
              variant="primary"
              text="Prejsť na stránku"
              :icon="Play"
              @click="handleNexus"
              class="bg-tertiary q-mr-md"
            />
            <IndexButton
              variant="outline"
              text="Documentation"
              :icon="OutBox"
              @click="handleDocumentation"
            />
          </div>
        </div>
      </div>
      <div class="q-ma-xl column align-center justify-center text-center showroom-container">
        <h2 class="text-h4 q-mb-md">Rozhranie progresívnej aplikácie Nexus</h2>
        <h3 class="text-h6 q-mb-md text-weight-thin q-mb-xl">
          Real-time chatovanie s elegantným dizajnom
        </h3>
        <img class="q-mb-xl" src="~assets/showroom.png" alt="Showroom" width="100%" height="100%" />
      </div>

      <div class="q-ma-xl column align-center justify-center text-center why-container">
        <h2 class="text-h4 q-mb-md">Prečo zvoliť Nexus?</h2>
        <h3 class="text-h6 q-mb-md text-weight-thin q-mb-xl">
          Moderná technológia, minimalistický dizajn a špičková funkcionalita
        </h3>

        <div class="row q-col-gutter-xl q-row-gutter-xl justify-center q-mb-xl">
          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center blue-container">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/chat.svg" alt="Real-time správy" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">Real-time správy</div>
              <div class="text-body2 text-secondary">
                Okamžité doručovanie správ <br />s WebSocket podporou.
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/teams.svg" alt="Kanály a tímy" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">Kanály a tímy</div>
              <div class="text-body2 text-secondary">
                Organizujte komunikáciu v kanáloch <br />s praktickým párom používateľov.
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center blue-container">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/phone.svg" alt="PWA podpora" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">PWA podpora</div>
              <div class="text-body2 text-secondary">
                Funguje ako natívna aplikácia na desktop <br />aj mobile zariadeniach.
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/shield.svg" alt="Bezpečnosť" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">Bezpečnosť</div>
              <div class="text-body2 text-secondary">
                JWT autentifikácia a zabezpečené API <br />endpointy s Adonis OAT.
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center blue-container">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/bolt_blue.svg" alt="Výkonný stack" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">Výkonný stack</div>
              <div class="text-body2 text-secondary">
                Vue 3 + Quasar + AdonisJS pre modernú <br />a škálovateľnú architektúru.
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="q-pa-lg border-rad shadow-xs column items-center">
              <div class="img-container q-mb-md row items-center justify-center">
                <img src="~assets/database.svg" alt="PostgreSQL" width="32" height="32" />
              </div>
              <div class="text-h6 q-mb-xs">PostgreSQL</div>
              <div class="text-body2 text-secondary">
                Spoľahlivá databáza s Lucid ORM pre <br />optimálny výkon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </q-page>
</template>

<script setup lang="ts">
import IndexButton from 'components/IndexButton.vue';
import GithubSvg from 'assets/GithubIcon.svg';
import BoltSvg from 'assets/Bolt.svg';
import Play from 'assets/Play.svg';
import OutBox from 'assets/outBox.svg';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleGithub() {
  window.open('https://github.com');
}

function handleDocumentation() {
  window.open('https://github.com');
}

async function handleNexus() {
  await router.push('/Chat');
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>
