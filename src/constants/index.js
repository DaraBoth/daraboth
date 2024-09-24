import {
  acc,
  makerlight,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  phsatech,
  git,
  figma,
  docker,
  nextjs,
  hrd,
  kosign,
  tinynotie,
  kshrdregi,
  rupp,
  googleadsense,
  accpremiumwrap,
  mankerlightkh,
  wewallet,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
  {
    id: "feedbacks",
    title: "Feedbacks",
  },
];

const services = [
  {
    title: "Side Hustle",
    icon: creator.src,
  },
  {
    title: "Content Creator",
    icon: creator.src,
  },
  {
    title: "Web Developer",
    icon: web.src,
  },
  {
    title: "Full Stack Web Developer",
    icon: web.src,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html.src,
  },
  {
    name: "CSS 3",
    icon: css.src,
  },
  {
    name: "JavaScript",
    icon: javascript.src,
  },
  {
    name: "TypeScript",
    icon: typescript.src,
  },
  {
    name: "React JS",
    icon: reactjs.src,
  },
  {
    name: "Redux Toolkit",
    icon: redux.src,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind.src,
  },
  {
    name: "Node JS",
    icon: nodejs.src,
  },
  {
    name: "NextJS",
    icon: nextjs.src,
  },
  {
    name: "git",
    icon: git.src,
  },
  {
    name: "figma",
    icon: figma.src,
  },
  {
    name: "docker",
    icon: docker.src,
  },
];

const experiences = [
  {
    title: "Side Hustle",
    company_name: "Google Adsense",
    icon: googleadsense.src,
    iconBg: "#383E56",
    date: "2016 - 2017",
    points: ["Make money with ads content on Website and Youtube"],
  },
  {
    title: "Bachelor Degree",
    company_name: " Computer Science at RUPP",
    icon: rupp.src,
    iconBg: "#383E56",
    date: "2017 - 2021",
    points: ["Learning C program", "Learning C++", "Learning C#", "Learning Java", "Data Structure and Algorythm"],
  },
  {
    title: "Angular Developer",
    company_name: "Phsar Tech",
    icon: phsatech.src,
    iconBg: "#383E56",
    date: "October 2019 - March 2020",
    points: [
      "Developing Ecommerce and Blog Content web applications using Angular JS.",
    ],
  },
  {
    title: "Content Creator",
    company_name: "ACC Premium Wraps",
    icon: acc.src,
    iconBg: "#383E56",
    date: "2020 - 2021",
    points: [
      "Car photographer, Editing Car's Picture, Sale, Customer Service, also build website for company.",
    ],
  }, 
  {
    title: "Content Creator",
    company_name: "Manker Light Cambodia",
    icon: makerlight.src,
    iconBg: "#383E56",
    date: "2021 - 2022",
    points: [
      "Manage Facebook page, Instagram page, Tiktok account by creating new content post everyday. Create weekly Talk-Show video.",
      " Create promotions for customer on every event. Customer service. Manage product store. Create future plan for company.",
    ],
  },
  {
    title: "HRD Center Trainee",
    company_name: "Korea Software HRD Center",
    icon: hrd.src,
    iconBg: "#E6DEDD",
    date: "February 14th - July 21st ,2022, Mon-Fri",
    points: [
      "JAVA, J2SE (Basic Java and OOP concepts), J2EE (Maven and MVC pattern).",
      "WEB, HTML, CSS, JavaScript, CSS FlexBox, Bootstrap 4, Tailwind, ReactJS, JSON.",
      "SPRING, Spring Boot, MyBatis Data Access, Spring RESTful Web Service, Spring Security, JSON Web Token, Thymeleaf Engine.",
      "Database, Data Modeling, PostgreSQL, SQL(Basic SQL, Advanced SQL).",
      "Additional Courses, Linux, Docker, Deployment and UI/UX.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "KOSIGN",
    icon: kosign.src,
    iconBg: "#383E56",
    date: "Argust 2022 14th - Current",
    points: [
      "Developing and maintaining web applications.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "MankerLight Cambodia",
    description:
      "E-commerce Website",
    tags: [
      {
        name: "angular",
        color: "blue-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: mankerlightkh.src,
    source_code_link: "https://mankerlightkh.web.app/",
  },
  {
    name: "Service and shop",
    description:
      "Car service website",
    tags: [
      {
        name: "angular",
        color: "blue-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: accpremiumwrap.src,
    source_code_link: "https://acc-premium-wraps.web.app/",
  },
  {
    name: "We Wallet Kh",
    description:
      "Money Saving Website",
    tags: [
      {
        name: "html",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "blue-text-gradient",
      },
      {
        name: "pwa",
        color: "pink-text-gradient",
      },
    ],
    image: wewallet.src,
    source_code_link: "https://wewalletkh.web.app/",
  },
  {
    name: "KSHRD-Registration",
    description:
      "Registration website for Korea Sofware HRD Center",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "spring_boot",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
      {
        name: "pwa",
        color: "blue-text-gradient",
      },
    ],
    image: kshrdregi.src,
    source_code_link: "https://kshrdregistraion.web.app/",
  },
  {
    name: "TinyNotie",
    description:
      "Manage your cash note with functionality",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "express_js",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
      {
        name: "serverless",
        color: "blue-text-gradient",
      },
    ],
    image: tinynotie.src,
    source_code_link: "https://www.tinynotie.bio/",
  },
];

export { services, technologies, experiences, testimonials, projects };
