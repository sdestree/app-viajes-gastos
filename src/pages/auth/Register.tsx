import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export default function Register() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password);
      navigate("/");
    } catch {
      setError("Error al crear la cuenta");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">
          Registrate para empezar a organizar viajes
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-button">
            Crear cuenta
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
