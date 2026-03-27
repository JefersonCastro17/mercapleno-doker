import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/base.css";
import "../styles/login.css";
import logo from "../logo.svg";
import { useAuthContext } from "../contexts/AuthContext";
import { httpRequest } from "../lib/api/httpClient";
import { API_ENDPOINTS } from "../lib/config/api.config";

function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const requestedRedirect = params.get("redirect");

    if (!requestedRedirect || !requestedRedirect.startsWith("/") || requestedRedirect.startsWith("//")) {
      return null;
    }

    if (requestedRedirect === "/login") {
      return null;
    }

    return requestedRedirect;
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [requireCode, setRequireCode] = useState(false);
  const [expectedCode, setExpectedCode] = useState("");
  const [userToVerify, setUserToVerify] = useState(null);
  const [tokenToVerify, setTokenToVerify] = useState(null);
  const [loading, setLoading] = useState(false);

  const finishLogin = (userData, authToken) => {
    login(userData, authToken);

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      return;
    }

    if (userData.id_rol === 1 || userData.id_rol === 2) {
      navigate("/usuarioC", { replace: true });
      return;
    }

    navigate("/catalogo", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (requireCode) {
      if (securityCode !== expectedCode) {
        alert("Codigo de seguridad incorrecto.");
        setLoading(false);
        return;
      }

      if (!userToVerify || !tokenToVerify) {
        alert("Error: No se encontro la informacion del usuario para completar la sesion.");
        setLoading(false);
        return;
      }

      finishLogin(userToVerify, tokenToVerify);
      alert("Inicio de sesion exitoso");
      setLoading(false);
      return;
    }

    try {
      const data = await httpRequest(API_ENDPOINTS.auth.login, {
        method: "POST",
        data: { email, password }
      });

      if (!data?.success) {
        alert(data?.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      setUserToVerify(data.user);
      setTokenToVerify(data.token);

      if (data.user.id_rol === 1) {
        setRequireCode(true);
        setExpectedCode("123");
        alert("Este usuario es ADMIN. Ingrese el codigo de seguridad.");
      } else if (data.user.id_rol === 2) {
        setRequireCode(true);
        setExpectedCode("456");
        alert("Este usuario es EMPLEADO. Ingrese el codigo de seguridad.");
      } else {
        finishLogin(data.user, data.token);
      }
    } catch (error) {
      if (error.status === 403 && error.data?.code === "EMAIL_NOT_VERIFIED") {
        alert("Debes verificar tu correo antes de iniciar sesion.");
        navigate(`/verificar?email=${encodeURIComponent(email)}`);
      } else {
        console.error("Error al iniciar sesion:", error);
        alert(error.message || "Error de conexion con el servidor de autenticacion.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="Logo" className="logo-img" />
            <h1 className="portal-title">Portal 2</h1>
          </div>

          <nav className="nav-links">
            <Link to="/" className="nav-btn">Inicio</Link>
            <Link to="/registro" className="nav-btn">Registrate</Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="form-container">
          <h2>Iniciar Sesion</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electronico</label>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={requireCode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contrasena</label>
              <input
                type="password"
                id="password"
                placeholder="Contrasena"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={requireCode}
              />
            </div>

            {requireCode ? (
              <div className="form-group">
                <label htmlFor="securityCode">Codigo de seguridad</label>
                <input
                  type="text"
                  id="securityCode"
                  placeholder="Ingrese el codigo de seguridad"
                  value={securityCode}
                  onChange={(event) => setSecurityCode(event.target.value)}
                  required
                />
              </div>
            ) : null}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="register-link">
              <p>
                Olvidaste tu contrasena? <Link to="/recuperar">Recuperala</Link>
              </p>
              <p>
                No tienes cuenta? <Link to="/registro">Registrate aqui</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
