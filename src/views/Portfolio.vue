<template>
    <div class="portfolio">

        <v-app-bar flat color="transparent" class="mt-2 mt-sm-4">
            <v-spacer></v-spacer>

            <div class="nav-pill d-flex align-center px-1 px-sm-2">
                <v-btn text small rounded class="px-2 px-sm-3" @click="goTo('#home')">Home</v-btn>
                <v-btn text small rounded class="px-2 px-sm-3" @click="goTo('#about')">About</v-btn>
                <v-btn text small rounded class="px-2 px-sm-3" @click="goTo('#hobbies')">Hobbies</v-btn>
                <v-btn text small rounded class="px-2 px-sm-3" @click="goTo('#projects')">Side Projects</v-btn>
            </div>

            <v-btn class="ml-1 ml-sm-3" icon @click="toggleDark()">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>

            <v-btn class="ml-3 d-none d-sm-flex"
                color="black" dark rounded large href="mailto:dullapah.t@gmail.com"
            >
                Contact me
            </v-btn>

            <v-spacer></v-spacer>
        </v-app-bar>

        <v-container>

            <section id="home" class="section">
                <v-row align="center">
                    <v-col cols="12" md="8" class="order-2 order-md-1">
                        <div v-reveal="{ from: 'up', delay: 0 }">
                            <div class="text-caption grey--text">Personal Information</div>

                            <h1 class="hero-title">
                                {{ profile.title }}
                                <span class="green--text text--lighten-1">{{ profile.titleGrey }}</span>
                            </h1>
                        </div>

                        <div class="mt-6 d-flex align-center flex-wrap" v-reveal="{ from: 'up', delay: 150 }">
                            <v-btn outlined rounded large class="mr-3 mb-2" @click="goTo('#about')">About me</v-btn>
                            <v-btn outlined rounded large class="mb-2" @click="goTo('#hobbies')">See my hobbies</v-btn>
                            <v-img
                                src="../assets/แมวมือ.png"
                                :width="$vuetify.breakpoint.xs ? 100 : 150"
                                :max-width="$vuetify.breakpoint.xs ? 100 : 150"
                                contain
                                class="flex-grow-0 ml-2 my-n4"
                            ></v-img>
                        </div>

                        <div class="mt-8 mt-md-12" v-reveal="{ from: 'up', delay: 300 }">
                            <div class="text-h6">{{ profile.tagline }}</div>
                            <div class="text-body-1 grey--text">{{ profile.subTagline }}</div>
                        </div>

                        <!-- แถบโลโก้เลื่อนวน -->
                        <div class="marquee mt-8" v-reveal="{ from: 'up', delay: 450 }">
                            <div class="marquee-track">
                                <div class="marquee-item" v-for="(tech, index) in loopTechs" :key="index">
                                    <v-avatar :size="$vuetify.breakpoint.xs ? 52 : 64" color="white" class="tech-circle">
                                        <img :src="tech.icon" :alt="tech.name" :title="tech.name" class="tech-img">
                                    </v-avatar>
                                </div>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" md="4" class="order-1 order-md-2 d-flex flex-column align-center">
                        <div class="d-flex flex-column align-center" v-reveal="{ from: 'right', delay: 200 }">
                            <div class="handwrite">hi, I'm {{ profile.nickname }}</div>
                            <v-img
                                src="../assets/myimg.png"
                                :max-width="$vuetify.breakpoint.xs ? 200 : 280"
                                contain
                            ></v-img>
                        </div>
                    </v-col>
                </v-row>
            </section>

            <section id="about" ref="about" class="section about-scroll" :style="{ height: aboutHeight }">
                <div class="about-sticky">
                    <div class="section-head mb-2 mb-md-6" v-reveal="{ from: 'up' }">
                        <div class="eyebrow"><span class="eyebrow-line"></span>ABOUT ME</div>
                        <h2 class="heading">About Me</h2>
                        <p class="section-sub d-none d-md-block">My background, education and what I do.</p>
                    </div>
                    <v-row align="center">
                        <v-col cols="12" md="8" class="py-1">
                            <div class="about-img-wrap">
                                <img
                                    v-for="(step, index) in educationSteps"
                                    :key="index"
                                    :src="step.image"
                                    :alt="step.title"
                                    class="about-img"
                                    :class="{ active: index === activeIndex }"
                                >
                            </div>
                        </v-col>

                        <v-col cols="12" md="4" class="font-kanit py-1">
                            <div class="text-caption about-label">ชื่อ-นามสกุล</div>
                            <div class="text-subtitle-1 text-md-h5 font-weight-bold">{{ profile.fullNameTh }}</div>

                            <div class="text-caption about-label mt-2 mt-md-4">ชื่อเล่น</div>
                            <div class="text-subtitle-1 text-md-h6">{{ profile.nicknameTh }}</div>

                            <div class="text-caption about-label mt-3 mt-md-6 mb-2 mb-md-4">การศึกษา</div>

                            <div class="edu-tree">
                                <div
                                    class="edu-item"
                                    v-for="(step, index) in educationSteps"
                                    :key="index"
                                    :class="{
                                        show: index <= activeIndex,
                                        current: index === activeIndex,
                                        done: index < activeIndex
                                    }"
                                >
                                    <span class="edu-dot"></span>
                                    <div class="edu-level">{{ step.level }}</div>
                                    <div class="edu-title">{{ step.title }}</div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </section>

            <section id="hobbies" class="section">
                <div class="section-head mb-8" v-reveal="{ from: 'up' }">
                    <div class="eyebrow"><span class="eyebrow-line"></span>MY HOBBIES</div>
                    <h2 class="heading">Hobbies / Likes</h2>
                    <p class="section-sub">Things I enjoy doing in my free time.</p>
                </div>

                <v-row>
                    <v-col v-for="(item, index) in hobbies" :key="index" cols="12" sm="6" md="4" class="font-kanit" v-reveal="{ from: 'up', delay: index * 150 }">
                        <v-card flat rounded="xl" class="hobby-card pa-4 fill-height">
                            <div v-if="item.image" class="hobby-img-wrap mb-3">
                                <img :src="item.image" :alt="item.name" class="hobby-img">
                            </div>
                            <v-card-title class="justify-center text-center">{{ item.name }}</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </section>

            <section id="projects" class="section pb-12">
                <div class="section-head mb-8" v-reveal="{ from: 'up' }">
                    <div class="eyebrow"><span class="eyebrow-line"></span>SIDE PROJECTS</div>
                    <h2 class="heading">Side Projects</h2>
                    <p class="section-sub">Personal projects I build to practice and explore new ideas.</p>
                </div>

                <v-row>
                    <v-col
                        v-for="(project, index) in projects" :key="project.name" cols="12" sm="6" lg="3" class="d-flex" v-reveal="{ from: 'up', delay: index * 120 }"
                    >
                        <div class="project-card font-kanit">
                            <div class="project-img-wrap">
                                <img :src="project.image" :alt="project.name" class="project-img">
                            </div>

                            <div class="project-body">
                                <div class="project-tag">{{ project.tag }}</div>
                                <h3 class="project-name">{{ project.name }}</h3>
                                <p class="project-detail">{{ project.detail }}</p>

                                <div class="project-bottom">
                                    <div class="project-stack">
                                        <span v-for="tech in project.stack" :key="tech">{{ tech }}</span>
                                    </div>
                                    <v-btn v-if="project.demo || project.link" icon small outlined :href="project.demo || project.link" target="_blank" rel="noopener" aria-label="Open project">
                                        <v-icon small>mdi-arrow-top-right</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </section>

        </v-container>

        <v-footer padless color="#1A1818" dark>
            <v-container class="py-8 py-md-10 font-kanit">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-img
                            src="../assets/แมวเหม่อ.png"
                            alt="logo"
                            max-width="140"
                            contain
                        ></v-img>
                    </v-col>

                    <v-col cols="12" md="4">
                        <div class="footer-heading mb-3">ลิงก์</div>
                        <div class="footer-links text-base">
                            <a class="footer-link" @click="goTo('#home')">Home</a>
                            <a class="footer-link" @click="goTo('#about')">About</a>
                            <a class="footer-link" @click="goTo('#hobbies')">Hobbies</a>
                            <a class="footer-link" @click="goTo('#projects')">Side Projects</a>
                        </div>
                    </v-col>

                    <v-col cols="12" md="4">
                        <div class="footer-heading mb-3">ช่องทางติดต่อ</div>
                        <div class="d-flex">
                            <v-btn fab small depressed class="social-btn mr-3" href="https://github.com/minnimall" target="_blank" aria-label="GitHub">
                                <v-icon>mdi-github</v-icon>
                            </v-btn>
                            <v-btn fab small depressed class="social-btn mr-3" href="mailto:dullapah.ta@inet.co.th" aria-label="Email">
                                <v-icon>mdi-email</v-icon>
                            </v-btn>
                            <v-btn fab small depressed class="social-btn mr-3" href="https://www.facebook.com/dullapah.taweesangsiri" target="_blank" aria-label="Facebook">
                                <v-icon>mdi-facebook</v-icon>
                            </v-btn>
                            <v-btn fab small depressed class="social-btn" href="https://www.instagram.com/min.nimall/" target="_blank" aria-label="Instagram">
                                <v-icon>mdi-instagram</v-icon>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <div class="d-flex flex-column flex-sm-row justify-space-between text-body-2 grey--text text--lighten-1">
                    <div class="mb-2 mb-sm-0">Portfolio</div>
                    <div>
                        Designed &amp; Developed by
                        <span class="white--text">Dullapah Taweesaengsiri</span>
                    </div>
                </div>

                <p class="grey--text text-sm text--darken-1 mt-4 mb-0 footer-note">
                    © 2026 Portfolio Dullapah Taweesaengsiri. All rights reserved.
                </p>
            </v-container>
        </v-footer>
    </div>
</template>

<script>
const base = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'
export default {
    // directive สำหรับ animation ตอนเลื่อนมาถึง element
    // ใช้: v-reveal="{ from: 'up' | 'left' | 'right', delay: 0 }"
    directives: {
        reveal: {
            inserted(el, binding) {
                const { from = 'up', delay = 0 } = binding.value || {}
                el.classList.add('reveal', `reveal-${from}`)
                if (delay) {
                    el.style.transitionDelay = `${delay}ms`
                    // เคลียร์ delay หลังเล่นเสร็จ จะได้ไม่กระทบ hover
                    el.addEventListener('transitionend', () => {
                        el.style.transitionDelay = ''
                    }, { once: true })
                }

                if (!('IntersectionObserver' in window)) {
                    el.classList.add('reveal-in')
                    return
                }

                const io = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        el.classList.add('reveal-in')
                        io.disconnect() // เล่นครั้งเดียว
                    }
                }, { threshold: 0.15 })

                io.observe(el)
                el._revealIO = io
            },
            unbind(el) {
                if (el._revealIO) el._revealIO.disconnect()
            }
        }
    },
    data() {
        return {
            activeIndex: 0,
            stepVh: 90, // เลื่อนกี่ vh ต่อ 1 step (เพิ่มค่าถ้าอยากให้เลื่อนนานขึ้น)
            profile: {
                fullName: 'Dullapah Taweesaengsiri',
                fullNameTh: 'นายดุลพาห์ ทวีแสงศิริ',
                nicknameTh: 'มินห์',
                nickname: 'Min',
                title: 'Software Engineer',
                titleGrey: 'INET.',
                tagline: '< Dullapah Taweesaengsiri >',
                subTagline: 'Dream Big. Code Bigger.',
                education: 'B.Sc. Information Technology, Khon Kaen University'
            },
            hobbies: [
                { name: 'เล่นเกมส์',image: require('../assets/hobbies/hobbiesgame.png') },
                { name: 'ฟังเพลง', image: require('../assets/hobbies/hobbiesmusic.png') },
                { name: 'ดู YOUTUBE', image: require('../assets/hobbies/hobbiesyoutube.png') },
                { name: 'เกมส์ที่ชอบ', image: require('../assets/hobbies/logopubg.png') },
                { name: 'วงที่ชอบฟัง', image: require('../assets/hobbies/tattoocolour.jpg') },
                { name: 'ช่อง YOUTUBE ที่ชอบดู', image: require('../assets/hobbies/bannerrubsarb.jpg') },
            ],
            projects: [
                {
                    name: 'Rubsarb Fanweb',
                    tag: 'Website',
                    detail: 'เว็บไซต์ ช่องยูทูปรับทราบ (RUBSARB) แฟนเมด',
                    stack: ['HTML', 'CSS', 'JavaScript'],
                    tall: false,
                    image: require('../assets/project/rubsarb.png'),
                    link: 'https://rubsarb.vercel.app/',
                    demo: '',
                },
                {
                    name: 'Meowmoney',
                    tag: 'Webapplication',
                    detail: 'เว็บแอปพลิเคชัน Meowmoney ระบบบันทึกรายรับรายจ่าย',
                    stack: ['React', 'Express', 'MongoDB'],
                    tall: true,
                    image: require('../assets/project/meowmoney.png'),
                    link: 'https://meowmoney-nine.vercel.app/',
                    demo: '',
                },
                {
                    name: 'CompMart',
                    tag: 'Webapplication',
                    detail: 'เว็บแอปพลิเคชันคอมมูนิตี้ซื้อขายอุปกรณ์คอมพิวเตอร์',
                    stack: ['NextJS', 'Supabase'],
                    tall: true,
                    image: require('../assets/project/compmart.png'),
                    link: 'https://comp-mart-hazel.vercel.app/',
                    demo: ''
                },
                {
                    name: 'WashGo',
                    tag: 'Webapplication',
                    detail: 'เว็บแอปพลิเคชันรับซักผ้าส่งผ้าถึงที่',
                    stack: ['React', 'ASP.Net', 'Supabase'],
                    tall: false,
                    image: require('../assets/project/washgo.png'),
                    link: 'https://wash-go-tawny.vercel.app/',
                    demo: ''
                }
            ],
            techs: [
                { name: 'HTML', icon: `${base}/html5/html5-original.svg` },
                { name: 'CSS', icon: `${base}/css3/css3-original.svg` },
                { name: 'JavaScript', icon: `${base}/javascript/javascript-original.svg` },
                { name: 'Java', icon: `${base}/java/java-original.svg` },
                { name: 'PHP', icon: `${base}/php/php-original.svg` },
                { name: 'Kotlin', icon: `${base}/kotlin/kotlin-original.svg` },
                { name: 'Laravel', icon: `${base}/laravel/laravel-original.svg` },
                { name: 'React', icon: `${base}/react/react-original.svg` },
                { name: 'Spring Boot', icon: `${base}/spring/spring-original.svg` },
                { name: 'Express.js', icon: `${base}/express/express-original.svg` },
                { name: 'MongoDB', icon: `${base}/mongodb/mongodb-original.svg` },
                { name: 'MySQL', icon: `${base}/mysql/mysql-original.svg` },
                { name: 'VS Code', icon: `${base}/vscode/vscode-original.svg` },
                { name: 'Eclipse', icon: `${base}/eclipse/eclipse-original.svg` },
                { name: 'Android Studio', icon: `${base}/androidstudio/androidstudio-original.svg` },
                { name: 'GitHub', icon: `${base}/github/github-original.svg` },
                { name: 'Figma', icon: `${base}/figma/figma-original.svg` }
            ],
            educationSteps: [
                {
                    level: 'มหาวิทยาลัย',
                    title: 'มหาวิทยาลัยขอนแก่น',
                    image: require('../assets/kku.png')
                },
                {
                    level: 'คณะ',
                    title: 'วิทยาลัยการคอมพิวเตอร์',
                    image: require('../assets/logocpp.png')
                },
                {
                    level: 'สาขา',
                    title: 'เทคโนโลยีสารสนเทศ',
                    image: require('../assets/it.jpg')
                },
                {
                    level: 'แทร็ก',
                    title: 'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่และเว็บ',
                    image: require('../assets/webapp (1).jpg')
                }
            ]
        }
    },
    computed: {
        loopTechs() {
            return [...this.techs, ...this.techs]
        },
        // ความสูงของ section = 1 หน้าจอ + ระยะเลื่อนของทุก step
        aboutHeight() {
            return (100 + this.educationSteps.length * this.stepVh) + 'vh'
        }
    },
    mounted() {
        // capture: true เพื่อจับการเลื่อนจากทุก element (เผื่อหน้าเลื่อนใน v-main ไม่ใช่ window)
        window.addEventListener('scroll', this.onScroll, { passive: true, capture: true })
        window.addEventListener('resize', this.onScroll)
        this.onScroll()
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll, { capture: true })
        window.removeEventListener('resize', this.onScroll)
    },
    methods: {
        goTo(target) { // เลื่อนหน้าไปยัง section (ฟังก์ชันของ Vuetify)
            this.$vuetify.goTo(target)
        },
        toggleDark() { // สลับโหมดมืด/สว่าง
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        },
        onScroll() {
            const el = this.$refs.about
            if (!el) return
            const rect = el.getBoundingClientRect()
            const total = el.offsetHeight - window.innerHeight // ระยะที่ section ค้างอยู่
            if (total <= 0) return
            const progress = Math.min(Math.max(-rect.top / total, 0), 1)
            const n = this.educationSteps.length
            this.activeIndex = Math.min(Math.floor(progress * n), n - 1)
        },
        scrollProjects(dir) {
            const el = this.$refs.projectStrip
            if (el) el.scrollBy({ left:dir * 300, behavior: 'smooth' })
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&display=swap');


    .portfolio {
        /* กัน scroll แนวนอนจาก animation เลื่อนเข้าด้านข้าง
           ใช้ clip แทน hidden เพราะ hidden จะทำให้ position: sticky พัง */
        overflow-x: clip;
    }
    .portfolio .font-kanit,
    .portfolio .font-kanit * {
        font-family: 'Kanit', sans-serif !important;
    }
    .nav-pill {
        border-radius: 999px;
        height: 48px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    .section {
        min-height: 80vh;
        padding-top: 48px;
    }
    .hero-title {
        font-size: clamp(2.4rem, 8vw, 4rem);
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-top: 8px;
    }
    .handwrite {
        font-family: 'Caveat', cursive;
        font-size: 1.8rem;
        margin-bottom: 8px;
    }
    /* ===== Section heading ===== */
    .heading {
        text-align: left;
        font-size: clamp(2rem, 6vw, 2.8rem);
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin: 4px 0 0;
    }
    .eyebrow {
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.6;
    }
    .eyebrow-line {
        display: inline-block;
        width: 40px;
        height: 2px;
        margin-right: 12px;
        background-color: currentColor;
    }
    .section-sub {
        margin: 12px 0 0;
        font-size: clamp(1rem, 2.5vw, 1.15rem);
        opacity: 0.65;
    }

    /* ===== Scroll reveal ===== */
    .reveal {
        opacity: 0;
        transition: opacity 0.7s ease, transform 0.7s ease;
        will-change: opacity, transform;
    }
    .reveal-up { transform: translateY(32px); }
    .reveal-left { transform: translateX(-48px); }
    .reveal-right { transform: translateX(48px); }
    .reveal.reveal-in {
        opacity: 1;
        transform: none;
    }
    @media (max-width: 600px) {
        .reveal-left { transform: translateX(-24px); }
        .reveal-right { transform: translateX(24px); }
    }
    @media (prefers-reduced-motion: reduce) {
        .reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }

    /* ===== Marquee ===== */
    .marquee {
        overflow: hidden;
        /* ให้ขอบซ้ายขวาค่อยๆ จางหาย */
        -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
        mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
    }
    .marquee-track {
        display: flex;
        width: max-content;
        animation: scroll-left 30s linear infinite;
    }
    .marquee-item {
        margin-right: 20px;
        flex-shrink: 0;
    }
    .tech-circle {
        border: 2px solid rgba(0, 0, 0, 0.08);
    }
    .tech-img {
        width: 36px;
        height: 36px;
        object-fit: contain;
    }
    @keyframes scroll-left {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
        .marquee-track { animation: none; }
    }
    @media (max-width: 600px) {
        .tech-img {
            width: 28px;
            height: 28px;
        }
        .marquee-item {
            margin-right: 12px;
        }
    }

    /* ===== About (sticky + scroll-driven) ===== */
    .section.about-scroll {
        min-height: auto;
        padding: 0;
    }
    .about-sticky {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 80px 0 24px; /* เว้นด้านบนไม่ให้ชนแถบเมนู */
    }

    /* สีตามธีมอัตโนมัติ (ใช้ได้ทั้งโหมดสว่างและมืด) */
    .about-label {
        opacity: 0.6;
    }

    /* รูปซ้อนกัน สลับด้วย opacity */
    .about-img-wrap {
        position: relative;
        width: 100%;
        height: 50vh;
    }
    .about-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transform: scale(0.96);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .about-img.active {
        opacity: 1;
        transform: scale(1);
    }

    /* เส้นโยงการศึกษา */
    .edu-tree {
        padding-left: 28px;
    }
    .edu-item {
        position: relative;
        padding-bottom: 24px;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .edu-item:last-child {
        padding-bottom: 0;
    }
    .edu-item.show {
        opacity: 1;
        transform: translateY(0);
    }

    .edu-dot {
        position: absolute;
        left: -28px;
        top: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid currentColor;
        background-color: transparent;
        box-sizing: border-box;
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    .edu-item.current .edu-dot {
        background-color: currentColor;
        box-shadow: 0 0 0 5px rgba(128, 128, 128, 0.25);
    }

    /* เส้นเชื่อมไปจุดถัดไป: วาดลงมาเมื่อเลื่อนผ่าน step นั้นแล้ว */
    .edu-item:not(:last-child)::before {
        content: '';
        position: absolute;
        left: -21px;
        top: 20px;
        bottom: -4px;
        width: 2px;
        background-color: currentColor;
        opacity: 0.5;
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.5s ease;
    }
    .edu-item.done::before {
        transform: scaleY(1);
    }

    .edu-level {
        font-size: 0.8rem;
        opacity: 0.6;
    }
    .edu-title {
        font-size: 1.1rem;
        font-weight: 500;
    }

    /* About บนจอเล็ก: ย่อรูปและระยะห่างให้พอดี 1 หน้าจอ */
    @media (max-width: 960px) {
        .about-sticky {
            justify-content: flex-start;
            padding-top: 72px;
        }
        .about-img-wrap {
            height: 26vh;
        }
        .edu-item {
            padding-bottom: 14px;
        }
        .edu-title {
            font-size: 0.95rem;
        }
    }

    /* ===== Hobbies card ===== */
    .hobby-card {
        /* เงาไล่เฉดในกรอบ: ล่างเข้ม ค่อย ๆ จางขึ้นข้างบน */
        overflow: hidden;
        transition: box-shadow 0.2s ease;
    }
    .hobby-img-wrap {
        height: 180px;
        overflow: hidden;      /* กันรูปที่ขยายล้นออกนอกกรอบรูป */
        border-radius: 16px;
    }
    .hobby-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.8s ease;
    }
    .hobby-card:hover .hobby-img {
        transform: scale(1.1);
    }
    @media (max-width: 600px) {
        .hobby-img-wrap {
            height: 140px;
        }
    }

    /* ===== Side Projects (1 แถว 4 ใบ ขนาดเท่ากัน) ===== */
    .project-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 24px;
        overflow: hidden;
        /* สีพื้นกึ่งโปร่ง ใช้ได้ทั้งโหมดสว่างและมืด ข้อความใช้สีของธีมเอง */
        background-color: rgba(128, 128, 128, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .project-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
    }
    .project-img-wrap {
        aspect-ratio: 16 / 10;
        overflow: hidden;
    }
    .project-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    .project-card:hover .project-img {
        transform: scale(1.08);
    }
    .project-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 16px 18px 18px;
    }
    .project-tag {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.55;
    }
    .project-name {
        margin: 4px 0 6px;
        font-size: 1.15rem;
        font-weight: 700;
        line-height: 1.3;
    }
    .project-detail {
        flex: 1;               /* ดันส่วนล่างให้ชิดขอบล่างเท่ากันทุกใบ */
        margin: 0 0 14px;
        font-size: 0.85rem;
        opacity: 0.7;
    }
    .project-bottom {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 8px;
    }
    .project-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
    .project-stack span {
        padding: 2px 10px;
        border-radius: 999px;
        background-color: rgba(128, 128, 128, 0.2);
        font-size: 0.72rem;
        font-weight: 600;
    }

    /* ===== Footer ===== */
    .footer-heading {
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        color: #9e9e9e;
    }
    .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
    }
    .footer-link {
        color: #d5c8c8;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.2s ease;
    }
    .footer-link:hover {
        color: #e2dcdc;
    }
    .social-btn {
        background-color: rgba(255, 255, 255, 0.08) !important;
    }
    .social-btn:hover {
        background-color: rgba(255, 255, 255, 0.18) !important;
    }
    .footer-note {
        max-width: 640px;
    }
</style>