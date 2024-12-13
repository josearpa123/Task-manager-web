import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateLogin = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/tasks");
      } catch (error) {
        setErrors({ general: "Correo o contraseña incorrectos." });
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <div className="login-box">
        <form onSubmit={handleLogin}>
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

          <button type="submit">Iniciar Sesión</button>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
        </form>
      </div>
      <p>
        ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default LoginPage;
