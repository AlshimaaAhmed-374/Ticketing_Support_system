import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { parseApiError } from "../api/axiosClient";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = await login(form);
      toast.success("Login success");
      if (auth.user.role === "admin") navigate("/admin/dashboard");
      else if (auth.user.role === "agent") navigate("/agent/dashboard");
      else navigate("/dashboard");
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Login</h2>
        <input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <p>New user? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};
