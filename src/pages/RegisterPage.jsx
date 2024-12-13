// RegisterPage.jsx con validaciones
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateRegister = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateRegister()) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (error) {
        setErrors({ general: "No se pudo registrar el usuario. Inténtalo de nuevo." });
      }
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}

        <button type="submit">Registrarse</button>
        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
      </form>
      <p>
        ¿Ya tienes una cuenta? <a href="/">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default RegisterPage;