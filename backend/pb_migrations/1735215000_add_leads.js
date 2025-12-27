migrate((db) => {
  const dao = new Dao(db);

  const leads = new Collection({
    name: "leads",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
        options: { min: 1, max: 255 }
      },
      {
        name: "email",
        type: "email",
        required: true
      },
      {
        name: "service_interest",
        type: "text",
        required: false
      },
      {
        name: "metadata",
        type: "json",
        required: false,
        options: {
          maxSize: 2000
        }
      }
    ],
    listRule: null,   // Admin only
    viewRule: null,   // Admin only
    createRule: "",   // Allow public create
    updateRule: null,
    deleteRule: null,
  });

  return dao.saveCollection(leads);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("leads");
  return dao.deleteCollection(collection);
})
