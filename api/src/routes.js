import express from "express";

const routes = express.Router();

routes.post("/certifications", async (req, res) => {
  const message = {
    user_name: "Luís Henrique",
    course: "kafka/Node.JS ",
  };

  await req.producer.send({
    topic: "issue-certificate",
    messages: [{ value: JSON.stringify(message) }],
  });
  return res.json({ ok: true });
});

export { routes };
