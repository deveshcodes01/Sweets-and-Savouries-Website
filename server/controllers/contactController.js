import Contact from "../models/Contact.js";
const clean = (v) =>
  typeof v === "string" ? v.replace(/[<>]/g, "").trim() : "";
export async function createContact(req, res, next) {
  const body = req.body || {};
  const data = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    subject: clean(body.subject),
    message: clean(body.message),
  };
  if (data.name.length < 2 || data.name.length > 100)
    return res
      .status(400)
      .json({ message: "Please enter a name between 2 and 100 characters." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  if (data.phone.length > 30)
    return res.status(400).json({ message: "Phone number is too long." });
  if (data.subject.length < 2 || data.subject.length > 150)
    return res.status(400).json({ message: "Please enter a subject." });
  if (data.message.length < 10 || data.message.length > 5000)
    return res
      .status(400)
      .json({ message: "Message must be between 10 and 5000 characters." });
  try {
    if (Contact.db.readyState !== 1)
      return res
        .status(503)
        .json({ message: "We couldn't send your note just now. Please try again shortly." });
    await Contact.create(data);
    res
      .status(201)
      .json({ message: "Thank you. Your message has been received." });
  } catch (e) {
    next(e);
  }
}
