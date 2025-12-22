migrate((db) => {
  const dao = new Dao(db);

  // 1. PROJECTS Collection
  const projects = new Collection({
    name: "projects",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 1, max: 255 }
      },
      {
        name: "description",
        type: "text",
        required: false,
        options: { max: 1000 }
      },
      {
        name: "image",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880, // 5MB
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        }
      },
      {
        name: "tags",
        type: "json",
        required: false,
        options: {
          maxSize: 2000000
        }
      },
      {
        name: "link",
        type: "url",
        required: false
      },
      {
        name: "work_date",
        type: "date",
        required: false
      },
      {
        name: "client",
        type: "relation",
        required: false,
        options: {
          collectionId: "clients", // Or use the collection name if ID is not known yet, but PB usually wants ID or Name. In migrations we often use name if created in same batch, but safely we can update it or just put existing name. Actually, in JS migration creating new collection, we don't have ID yet effectively. 
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: null
        }
      }
    ],
    listRule: "",   // Public read
    viewRule: "",   // Public read
    createRule: null, // Admin only
    updateRule: null, // Admin only
    deleteRule: null, // Admin only
  });

  // 2. PARTNERS Collection
  const partners = new Collection({
    name: "partners",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 1, max: 255 }
      },
      {
        name: "logo",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        }
      },
      {
        name: "website",
        type: "url",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  // 3. CLIENTS Collection
  const clients = new Collection({
    name: "clients",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 1, max: 255 }
      },
      {
        name: "logo",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        }
      },
      {
        name: "website",
        type: "url",
        required: false
      },
      {
        name: "logo_url",
        type: "url",
        required: false
      },
      {
        name: "year",
        type: "number",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  });

  // 4. TECH STACK Collection
  const techStack = new Collection({
      name: "tech_stack",
      type: "base",
      schema: [
        {
          name: "name",
          type: "text",
          required: true,
          options: { min: 1, max: 255 }
        },
        {
          name: "logo",
          type: "file",
          required: false,
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
          }
        },
        {
          name: "website",
          type: "url", // Domain for Logo.dev fallback (e.g., angular.io)
          required: false
        }
      ],
      listRule: "",
      viewRule: "",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });

  // 5. BLOG POSTS Collection (N8N Webhook Ready)
  const blogPosts = new Collection({
    name: "blog_posts",
    type: "base",
    schema: [
      {
        name: "title",
        type: "text",
        required: true,
        options: { min: 1, max: 255 }
      },
      {
        name: "slug",
        type: "text",
        required: true,
        options: { min: 1, max: 255, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" }
      },
      {
        name: "content",
        type: "editor", // Rich text editor
        required: true
      },
      {
        name: "excerpt",
        type: "text",
        required: false,
        options: { max: 500 }
      },
      {
        name: "cover_image",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        }
      },
      {
        name: "author",
        type: "text",
        required: false,
        options: { max: 100 }
      },
      {
        name: "published_date",
        type: "date",
        required: true
      },
      {
        name: "tags",
        type: "json",
        required: false
      },
      {
        name: "status",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["draft", "published"]
        }
      }
    ],
    listRule: "status = 'published'",
    viewRule: "status = 'published'",
    createRule: null, // Admin or N8N webhook with auth
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_blog_slug ON blog_posts (slug)",
      "CREATE INDEX idx_blog_status ON blog_posts (status)",
      "CREATE INDEX idx_blog_date ON blog_posts (published_date)"
    ]
  });

  // 6. TESTIMONIALS Collection
  const testimonials = new Collection({
    name: "testimonials",
    type: "base",
    schema: [
      {
        name: "client_name",
        type: "text",
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: "client_company",
        type: "text",
        required: false,
        options: { max: 100 }
      },
      {
        name: "client_logo",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 2097152, // 2MB
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        }
      },
      {
        name: "rating",
        type: "number",
        required: true,
        options: { min: 1, max: 5 }
      },
      {
        name: "quote",
        type: "text",
        required: true,
        options: { min: 10, max: 500 }
      },
      {
        name: "project_type",
        type: "text",
        required: false,
        options: { max: 100 }
      },
      {
        name: "featured",
        type: "bool",
        required: false
      },
      {
        name: "order",
        type: "number",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_testimonials_featured ON testimonials (featured)",
      "CREATE INDEX idx_testimonials_order ON testimonials (order)"
    ]
  });

  // 7. SERVICES Collection
  const services = new Collection({
    name: "services",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: "slug",
        type: "text",
        required: true,
        options: { min: 1, max: 100, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" }
      },
      {
        name: "description",
        type: "text",
        required: true,
        options: { max: 1000 }
      },
      {
        name: "icon",
        type: "text",
        required: false,
        options: { max: 50 } // Icon name or emoji
      },
      {
        name: "features",
        type: "json",
        required: false // Array of feature strings
      },
      {
        name: "pricing_tiers",
        type: "json",
        required: false // Object with Basic, Pro, Enterprise tiers
      },
      {
        name: "order",
        type: "number",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_services_slug ON services (slug)",
      "CREATE INDEX idx_services_order ON services (order)"
    ]
  });

  // 8. FAQ Collection
  const faq = new Collection({
    name: "faq",
    type: "base",
    schema: [
      {
        name: "question",
        type: "text",
        required: true,
        options: { min: 5, max: 300 }
      },
      {
        name: "answer",
        type: "text",
        required: true,
        options: { min: 10, max: 2000 }
      },
      {
        name: "category",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["generale", "prezzi", "supporto", "tecnico"]
        }
      },
      {
        name: "order",
        type: "number",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    indexes: [
      "CREATE INDEX idx_faq_category ON faq (category)",
      "CREATE INDEX idx_faq_order ON faq (order)"
    ]
  });

  try {
      dao.saveCollection(partners);
      dao.saveCollection(clients);
      dao.saveCollection(projects); // Depends on clients
      dao.saveCollection(techStack);
      dao.saveCollection(blogPosts);
      dao.saveCollection(testimonials);
      dao.saveCollection(services);
      dao.saveCollection(faq);
      
      // Seed Default Tech Stack
      const techItems = [
        { name: "Angular", website: "angular.io" },
        { name: "PocketBase", website: "pocketbase.io" },
        { name: "Docker", website: "docker.com" },
        { name: "Tailwind CSS", website: "tailwindcss.com" },
        { name: "Linux", website: "linux.org" },
        { name: "AWS", website: "aws.amazon.com" },
        { name: "TypeScript", website: "typescriptlang.org" },
        { name: "Node.js", website: "nodejs.org" }
      ];

      techItems.forEach(item => {
        const record = new Record(techStack);
        record.set("name", item.name);
        record.set("website", item.website);
        dao.saveRecord(record);
      });

      // Seed Clients from External API (merged)
      const clientItems = [
        {
            name: "Staffgroup",
            website: "https://www.halian.com/article/halian-has-acquired-staff-group",
            logo_url: "https://www.halian.com/_next/image?url=https%3A%2F%2Fhalians3prod1.s3.eu-central-1.amazonaws.com%2Fhalian_acquired_staffgroup_article_image_56b4975625.webp&w=1920&q=75",
            year: 2022
        },
        {
            name: "Sunnit",
            website: "https://sunnit.it/",
            logo_url: "https://sunnit.it/wp-content/uploads/2023/06/sunnitLogo-1.png",
            year: 2024
        },
        {
            name: "We World",
            website: "https://www.weworld.it/",
            logo_url: "https://www.weworld.it/prod/_nuxt/img/img_adoption.723de9c.jpg",
            year: 2024
        },
        {
            name: "CS Digital Productions",
            website: "https://www.youtube.com/watch?v=igctNbCMpRU&t=1s",
            logo_url: "https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-6/309156762_430929465794951_7508053469389419933_n.png?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=xb93Wp0ERwsAb65j2Ci&_nc_ht=scontent-fco2-1.xx&cb_e2o_trans=q&oh=00_AfCgQauWCLJXnixZKmsrhSLlISj5Qk_R9cgjx4inWn3riw&oe=66139A48",
            year: 2015
        },
        {
            name: "App Desk",
            website: "https://appdesk.it",
            logo_url: "",
            year: 2023
        },
        {
            name: "Aruba",
            website: "https://www.aruba.it/",
            logo_url: "https://media-assets.wired.it/photos/615dbc9293c5b56fdd48cbf3/master/w_1600%2Cc_limit/wired_placeholder_dummy.png",
            year: 2022
        },
        {
            name: "Auto Vip",
            website: "https://autovipitalia.it/",
            logo_url: "https://scontent-fco2-1.xx.fbcdn.net/v/t39.30808-6/430130339_122128438292198779_2116325912701363584_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=BIRuGU6sg7UAb4d1qyS&_nc_ht=scontent-fco2-1.xx&oh=00_AfDHPBsZHX7ALrTw4MssIq3dznWecvGeI_0dUmGFeKAW2g&oe=6613CACA",
            year: 2023
        },
        // Adding original local items with assumed years or defaults
        { name: "Canale 10", website: "https://www.tg10.it/archivio/index.php/archivio-canale-10-tg10-it", logo_url: "", year: 2020 },
        { name: "DN Tendaggi", website: "https://www.tendaggidinatale.com/", logo_url: "", year: 2021 },
        { name: "E-Planet", website: "https://www.eplanetcinemas.it/", logo_url: "https://www.gelaleradicidelfuturo.com/wp-content/uploads/2018/05/hollywood_cinema.jpg", year: 2019 },
        { name: "Extreme Garage", website: "https://www.extremegarage.it/", logo_url: "https://www.extremegarage.it/wp-content/uploads/2021/04/T8A5621-300x169.jpg", year: 2021 },
        { name: "Fake Brand", website: "htpps://fakebrand.shop", logo_url: "", year: 2023 },
        { name: "Rango", website: "https://www.rango.it/", logo_url: "", year: 2020 },
        { name: "Ballon Siena", website: "https://www.balloonsiena.it/", logo_url: "", year: 2022 },
        { name: "G&G Gioielli", website: "http://geggioielli.com/", logo_url: "", year: 2019 },
        { name: "Gazzettino di Gela", website: "https://www.ilgazzettinodigela.it/", logo_url: "", year: 2018 },
        { name: "Radio Gela Express", website: "https://www.radiogelaexpress.it/", logo_url: "", year: 2018 },
        { name: "Hermes Tv", website: "https://www.hermestv.it/", logo_url: "", year: 2017 },
        { name: "Palazzo Mattina", website: "https://palazzomattina.com", logo_url: "", year: 2021 },
        { name: "Parola della Grazia - Gela", website: "https://www.paroladellagraziagela.it", logo_url: "", year: 2016 },
        { name: "Aton IT", website: "https://www.atoninformatica.it/", logo_url: "", year: 2022 },
        { name: "J Revolution", website: "https://jrevolution.it/", logo_url: "", year: 2023 },
        { name: "Tele Gela 98", website: "https://www.quotidianodigela.it/telegela/", logo_url: "https://www.quotidianodigela.it/wp-content/themes/Newspaper-child/images/logo-telegela.png", year: 2015 }
      ];

      clientItems.forEach(item => {
        const record = new Record(clients);
        record.set("name", item.name);
        record.set("website", item.website);
        if (item.logo_url) {
            record.set("logo_url", item.logo_url);
        }
        if (item.year) {
            record.set("year", item.year);
        }
        dao.saveRecord(record);
      });

      console.log("Seeding additional collections...");

      // Seed Services
      const serviceItems = [
        {
          name: "Sviluppo Web & App",
          slug: "sviluppo-web-app",
          description: "Realizziamo applicazioni web moderne, veloci e scalabili su misura per il tuo business.",
          icon: "💻",
          features: ["Siti Web Responsive", "Web App Complesse", "E-commerce", "Integrazioni API"],
          pricing_tiers: {
            basic: { price: "€1000+", features: ["Landing Page", "SEO Base", "Form Contatto"] },
            professional: { price: "€2500+", features: ["Sito Multi-pagina", "CMS", "SEO Avanzata"] },
            enterprise: { price: "Custom", features: ["Web App Full Stack", "Database", "Scalabilità"] }
          },
          order: 1
        },
        {
          name: "UI/UX Design",
          slug: "ui-ux-design",
          description: "Progettiamo interfacce utente intuitive e accattivanti per garantire la migliore esperienza utente.",
          icon: "🎨",
          features: ["Prototipazione", "Wireframing", "Design System", "Mobile First"],
          order: 2
        }
      ];

      serviceItems.forEach(item => {
        const record = new Record(services);
        record.set("name", item.name);
        record.set("slug", item.slug);
        record.set("description", item.description);
        record.set("icon", item.icon);
        if (item.features) record.set("features", item.features);
        if (item.pricing_tiers) record.set("pricing_tiers", item.pricing_tiers);
        if (item.order) record.set("order", item.order);
        dao.saveRecord(record);
      });

      // Seed Testimonials
      const testimonialItems = [
        {
          client_name: "Marco Rossi",
          client_company: "Tech Solutions Srl",
          rating: 5,
          quote: "Il team di Eulab ha trasformato la nostra visione in realtà. Professionalità e competenza ai massimi livelli.",
          featured: true,
          order: 1
        },
        {
          client_name: "Giulia Bianchi",
          client_company: "Creative Studio",
          rating: 5,
          quote: "Un partner affidabile per lo sviluppo tecnologico. Tempi rispettati e qualità codice eccellente.",
          featured: true,
          order: 2
        }
      ];

      testimonialItems.forEach(item => {
        const record = new Record(testimonials);
        record.set("client_name", item.client_name);
        record.set("client_company", item.client_company);
        record.set("rating", item.rating);
        record.set("quote", item.quote);
        record.set("featured", item.featured);
        record.set("order", item.order);
        dao.saveRecord(record);
      });

      // Seed Blog Posts
      const blogItems = [
        {
          title: "Benvenuti nel nuovo sito Eulab",
          slug: "benvenuti-eulab",
          content: "<p>Siamo felici di annunciare il lancio della nostra nuova piattaforma web. Qui troverete tutti i nostri servizi e casi studio.</p>",
          status: "published",
          published_date: new Date().toISOString(),
          tags: ["News", "Azienda"]
        }
      ];

      blogItems.forEach(item => {
        const record = new Record(blogPosts);
        record.set("title", item.title);
        record.set("slug", item.slug);
        record.set("content", item.content);
        record.set("status", item.status);
        record.set("published_date", item.published_date);
        record.set("tags", item.tags);
        dao.saveRecord(record);
      });

      // Seed FAQ
      const faqItems = [
        {
          question: "Quanto costa sviluppare un sito web?",
          answer: "Il costo dipende dalla complessità del progetto. Offriamo soluzioni a partire da pacchetti base fino a sviluppi custom enterprise.",
          category: "prezzi",
          order: 1
        },
        {
          question: "Offrite supporto post-lancio?",
          answer: "Assolutamente sì. Tutti i nostri progetti includono un periodo di garanzia e offriamo piani di manutenzione annuali.",
          category: "supporto",
          order: 2
        }
      ];

      faqItems.forEach(item => {
        const record = new Record(faq);
        record.set("question", item.question);
        record.set("answer", item.answer);
        record.set("category", item.category);
        record.set("order", item.order);
        dao.saveRecord(record);
      });

      // Seed Partners
      const partnerItems = [
        { name: "Digital Ocean", website: "https://digitalocean.com" }
      ];

      partnerItems.forEach(item => {
        const record = new Record(partners);
        record.set("name", item.name);
        record.set("website", item.website);
        dao.saveRecord(record);
      });

      // Seed Projects
      const projectItems = [
        {
          name: "Eulab Corporate Website",
          description: "Il nostro sito web aziendale, sviluppato con Angular 19 e PocketBase.",
          work_date: new Date().toISOString(),
          tags: ["Angular", "PocketBase", "Tailwind"],
          link: "https://eulab.cloud"
        }
      ];

      projectItems.forEach(item => {
        const record = new Record(projects);
        record.set("name", item.name);
        record.set("description", item.description);
        record.set("work_date", item.work_date);
        record.set("tags", item.tags);
        record.set("link", item.link);
        dao.saveRecord(record);
      });

      console.log("Collections created and full Seed completed successfully");
  } catch (err) {
      console.log("Error creating collections (might already exist):", err);
  }

}, (db) => {
  const dao = new Dao(db);
  try {
      try { dao.deleteCollection(dao.findCollectionByNameOrId("projects")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("partners")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("clients")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("tech_stack")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("blog_posts")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("testimonials")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("services")); } catch(_) {}
      try { dao.deleteCollection(dao.findCollectionByNameOrId("faq")); } catch(_) {}
  } catch (err) {
      console.log("Error reverting migrations:", err);
  }
})
