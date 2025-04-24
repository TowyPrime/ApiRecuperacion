const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/enviar-codigo", async (req, res) => {
  const { email, code } = req.body;

  // Validación de campos vacíos
  if (!email || !code) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Correo electrónico no válido" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Taquería Lety" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Has solicitado cambiar tu contraseña.\nCódigo de recuperación: ${code}\n\nEste correo fue enviado a ${email} porque estás registrado con Taquería Lety.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
