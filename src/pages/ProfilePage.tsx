import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../contexts/AuthContext";
import TopTabs from "./TopTabs";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setName(snap.data().name || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user || !name.trim()) return;

    try {
      setSaving(true);
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
      });
      alert("Perfil actualizado");
    } catch (error) {
      console.error("Error guardando perfil", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Cargando perfil...</p>;

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <h1>Gastos de Viaje</h1>
        <p className="text-muted" style={{ color: "#E5E7EB" }}>
          Gestiona tus viajes con amigos
        </p>
      </header>

      <main className="page-content">
        <TopTabs />

        {/* CARD PERFIL */}
        <div className="card profile-card">
          <div className="profile-header">
            <div className="avatar">{initial}</div>

            <div className="profile-info">
              <h2>{name || "Usuario"}</h2>
              <span className="edit-link">Editar perfil</span>
            </div>
          </div>

          <div className="profile-form">
            <label>Nombre / Apodo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sele, Ana, Juan"
            />

            <button
              className="btn-primary"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="card logout-card">
          <button className="btn-logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </div>

        {/* ACERCA DE */}
        <div className="card about-card">
          <h2>Acerca de la app</h2>
          <p className="text-muted">
            Gestiona los gastos de tus viajes con amigos de forma fácil y
            transparente. Crea viajes, agrega gastos y calcula automáticamente
            quién debe a quién.
          </p>
          <p className="text-muted">
            Hecha con amor por Sel <i className="bi bi-balloon-heart"></i>
          </p>
        </div>
      </main>
    </div>
  );
}
