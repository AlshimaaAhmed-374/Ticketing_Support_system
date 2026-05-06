import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { parseApiError } from "../api/axiosClient";
import { useToast } from "../hooks/useToast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Register success, please login");
      navigate("/login");
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Register</h2>
        <input placeholder="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="agent">agent</option>
        </select>
        <button className="btn" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        <p>Have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};
