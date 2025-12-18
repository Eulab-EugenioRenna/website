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
        required: false
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

  try {
      dao.saveCollection(projects);
      dao.saveCollection(partners);
      dao.saveCollection(clients);
      dao.saveCollection(techStack);
      
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

      console.log("Collections created and Tech Stack seeded successfully");
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
  } catch (err) {
      console.log("Error reverting migrations:", err);
  }
})
