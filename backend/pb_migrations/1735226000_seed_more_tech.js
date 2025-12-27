migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tech_stack");

  const techItems = [
    { name: "React", website: "react.dev" },
    { name: "Vue", website: "vuejs.org" },
    { name: "Next.js", website: "nextjs.org" },
    { name: "PostgreSQL", website: "postgresql.org" },
    { name: "Redis", website: "redis.io" },
    { name: "Python", website: "python.org" },
    { name: "Go", website: "go.dev" },
    { name: "Rust", website: "rust-lang.org" },
    { name: "Figma", website: "figma.com" },
    { name: "GitHub", website: "github.com" },
    { name: "Vercel", website: "vercel.com" },
    { name: "Firebase", website: "firebase.google.com" },
    { name: "MongoDB", website: "mongodb.com" }
  ];

  techItems.forEach(item => {
    try {
      // Check if already exists by name to avoid duplicates if migration is re-run
      dao.findFirstRecordByData("tech_stack", "name", item.name);
    } catch (e) {
      const record = new Record(collection);
      record.set("name", item.name);
      record.set("website", item.website);
      dao.saveRecord(record);
    }
  });
}, (db) => {
  // No revert needed for seeding
})
