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
          <IndexButton variant="ghost" text="Dokumentácia" @click="handleDocumentation" />
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
    <div class="row column justify-center items-center body-container">
      <div class="header-container limited-width">
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
      <div class="q-my-xl column align-center justify-center text-center showroom-container limited-width">
        <h2 class="text-h4 q-mb-md">Rozhranie progresívnej aplikácie Nexus</h2>
        <h3 class="text-h6 q-mb-md text-weight-thin q-mb-xl">
          Real-time chatovanie s elegantným dizajnom
        </h3>
        <img class="q-mb-xl" src="~assets/showroom.png" alt="Showroom" width="100%" height="100%" />
      </div>

      <div class="q-my-xl column align-center justify-center text-center why-container limited-width">
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
      <div class="column align-center justify-center text-center q-my-xl limited-width q-my-xl">
        <h2 class="text-h4 q-mb-xl">Technologický Stack</h2>
        <div class="row q-col-gutter-lg justify-center tech-stack-cards">
          <div class="col-12 col-sm-6 col-md-4 col-lg">
            <div class="tech-card column items-center">
              <div class="tech-icon-container vue-icon">
                <span>V3</span>
              </div>
              <h3 class="text-h6 q-mt-md q-mb-xs">Vue 3</h3>
              <p class="text-body2 text-grey-6">Composition API</p>
            </div>
          </div>
          
          <div class="col-12 col-sm-6 col-md-4 col-lg">
            <div class="tech-card column items-center">
              <div class="tech-icon-container quasar-icon">
                <span>Q</span>
              </div>
              <h3 class="text-h6 q-mt-md q-mb-xs">Quasar</h3>
              <p class="text-body2 text-grey-6">SPA + PWA</p>
            </div>
          </div>
          
          <div class="col-12 col-sm-6 col-md-4 col-lg">
            <div class="tech-card column items-center">
              <div class="tech-icon-container adonis-icon">
                <span>A</span>
              </div>
              <h3 class="text-h6 q-mt-md q-mb-xs">AdonisJS</h3>
              <p class="text-body2 text-grey-6">REST API</p>
            </div>
          </div>
          
          <div class="col-12 col-sm-6 col-md-4 col-lg">
            <div class="tech-card column items-center">
              <div class="tech-icon-container postgres-icon">
                <span>PG</span>
              </div>
              <h3 class="text-h6 q-mt-md q-mb-xs">PostgreSQL</h3>
              <p class="text-body2 text-grey-6">Databáza</p>
            </div>
          </div>
          
          <div class="col-12 col-sm-6 col-md-4 col-lg">
            <div class="tech-card column items-center">
              <div class="tech-icon-container docker-icon">
                <span>D</span>
              </div>
              <h3 class="text-h6 q-mt-md q-mb-xs">Docker</h3>
              <p class="text-body2 text-grey-6">Kontajnerizácia</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-start-section q-mt-xl" style="width: 100vw; margin-top: 100px;">
        <div class="quick-start-content">
          <h2 class="text-h3 q-mb-md text-white">Začnite za pár minút</h2>
          <h3 class="text-h6 q-mb-lg text-white text-weight-thin">Jednoduché nastavenie s Node.js a PostgreSQL</h3>
          
          <div class="code-block">
            <div class="code-line green-comment"># Backend setup</div>
            <div class="code-line">cd app/backend</div>
            <div class="code-line">npm install && npm run dev</div>
            <div class="code-line"></div>
            <div class="code-line green-comment"># Frontend setup</div>
            <div class="code-line">cd app/frontend</div>
            <div class="code-line">npm install && npm run dev</div>
          </div>
          
          <div class="q-mt-lg">
            <IndexButton
              variant="primary"
              text="Prejsť na GitHub"
              :icon="GithubSvg"
              @click="handleGithub"
              class="github-button"
            />
          </div>
        </div>
      </div>
      
      <footer style="width: 100vw;" class="q-py-xl">
        <div class="footer-content">
          <div class="footer-top">
            <div class="footer-logo">
              <div class="logo-icon">
                <span>#</span>
              </div>
              <span class="logo-text">Nexus</span>
            </div>
            <div>
              <IndexButton variant="ghost" text="Dokumentácia" @click="handleDocumentation" class="footer-link"/>
              <IndexButton variant="ghost" text="Dokumentácia" @click="handleDocumentation" class="footer-link"/>
            </div>
          </div>
          <div class="footer-separator"></div>
          <div class="footer-bottom">
            <p class="footer-copyright">© 2024 Nexus IRC. Vytvorené s Vue 3, Quasar a AdonisJS.</p>
          </div>
        </div>
      </footer>
    </div>
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
  window.open('https://github.com/BenjoSVK/VPWA');
}

function handleDocumentation() {
  window.open('https://github.com/BenjoSVK/VPWA#nexus-irc-slack-style--quasar--adonisjs');
}

async function handleNexus() {
  await router.push('/Chat');
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';

.tech-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  min-height: 180px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.tech-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-weight: bold;
    font-size: 1rem;
  }
}

.vue-icon {
  background: #DCFCE7;
  color: #00A63E;
}

.quasar-icon {
  background: #DBEAFE;
  color: #155DFC;
}

.adonis-icon {
  background: #F3E8FF;
  color: #9810FA;
}

.postgres-icon {
  background: #E0E7FF;
  color: #4F39F6;
}

.docker-icon {
  background: #CEFAFE;
  color: #0092B8;
}

.quick-start-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  padding: 80px;
}

.quick-start-section {
  background: linear-gradient(135deg, #155DFC 0%, #9810FA 100%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-block {
  background: #00000020;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.code-line {
  color: #E5E7EB;
  margin-bottom: 0.5rem;
}

.github-button {
  background: white !important;
  color: #155DFC !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.github-button :deep(.icon-custom) {
  filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1352%) hue-rotate(213deg) brightness(119%) contrast(119%);
}

.green-comment {
  color: #7BF1A8;
}

footer {
  background: white;
  padding-top: 50px !important;
  padding-bottom: 50px !important;
  border-top: 1px solid #E2E8F0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #8B5CF6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1A1A1A;
}

.footer-link {
  color: #4A5568;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #2D3748;
}

.footer-separator {
  height: 1px;
  background: #E2E8F0;
  margin-bottom: 2rem;
}

.footer-bottom {
  text-align: center;
}

.footer-copyright {
  color: #4A5568;
  font-size: 0.875rem;
  margin: 0;
}
</style>