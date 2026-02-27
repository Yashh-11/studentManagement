"use client";
import React, { useState, useEffect } from "react";
import apiInstance from "./api/axios/apiInstance";

const Page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUser(editingId, user);
      setEditingId(null);
    } else {
      await createUser(user);
    }
    setUser({});
    fetchUsers();
  };

  const handleDelete = async (id) => {
    try {
      await apiInstance.delete(`/user?id=${id}`);
      setList(list.filter((val) => val.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setUser({});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (selectedUser) => {
    setEditingId(selectedUser.id);
    setUser({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      course: selectedUser.course || "",
      number: selectedUser.number || "",
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await apiInstance.get('/user');
      setList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createUser = async (user) => {
    try {
      await apiInstance.post('/user', user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      await apiInstance.put(`/user?id=${id}`, updatedUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <main className="dashboard-root">
        <div className="bg-accent bg-accent-one" />
        <div className="bg-accent bg-accent-two" />
        <div className="content-wrap">
          <header className="hero">
            <p className="hero-kicker">Admin Console</p>
            <h1>Student Management System</h1>
            <p className="hero-subtitle">
              Create, update, and manage student profiles in one place.
            </p>
            <div className="hero-stats">
              <div className="stat-chip">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{list.length}</span>
              </div>
              <div className="stat-chip">
                <span className="stat-label">Mode</span>
                <span className="stat-value">
                  {editingId ? "Editing" : "Creating"}
                </span>
              </div>
            </div>
          </header>

          <section className="workspace-grid">
            <article className="panel form-panel">
              <div className="panel-heading">
                <h2>{editingId ? "Update Student" : "Add New Student"}</h2>
                <p>Fill in the fields below and submit to save.</p>
              </div>

              <form id="todo" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Username</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name || ""}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="ui-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="ui-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="course">Course</label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={user.course || ""}
                    onChange={handleChange}
                    placeholder="Enter course name"
                    className="ui-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="number">GR ID</label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    value={user.number || ""}
                    onChange={handleChange}
                    placeholder="Enter GR ID"
                    className="ui-input"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary-ui">
                    {editingId ? "Update Student" : "Add Student"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn-secondary-ui"
                      onClick={() => {
                        setEditingId(null);
                        setUser({});
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </article>

            <article className="panel table-panel">
              <div className="panel-heading">
                <h2>Student Directory</h2>
                <p>Use edit or delete actions to manage records.</p>
              </div>

              <div className="table-scroll">
                <table className="directory-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>GR ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list?.map((student, index) => {
                      const { id, name, email, course, number } = student;
                      return (
                        <tr key={id}>
                          <td>{index + 1}</td>
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>{course}</td>
                          <td>{number}</td>
                          <td className="table-actions">
                            <button
                              className="btn-table btn-edit"
                              type="button"
                              onClick={() => handleEdit(student)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-table btn-delete"
                              type="button"
                              onClick={() => handleDelete(id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {list.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          No students added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </div>
      </main>

      <style jsx>{`
        :global(body) {
          background: radial-gradient(
              circle at 15% 20%,
              rgba(16, 185, 129, 0.25),
              transparent 40%
            ),
            radial-gradient(
              circle at 85% 0%,
              rgba(251, 146, 60, 0.22),
              transparent 38%
            ),
            #f3f7f8;
          color: #122329;
          min-height: 100vh;
        }

        .dashboard-root {
          position: relative;
          padding: 2.5rem 1rem 3rem;
          overflow: hidden;
        }

        .content-wrap {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .bg-accent {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 999px;
          filter: blur(10px);
          animation: drift 8s ease-in-out infinite;
          pointer-events: none;
        }

        .bg-accent-one {
          top: -100px;
          right: -80px;
          background: rgba(20, 184, 166, 0.22);
        }

        .bg-accent-two {
          bottom: -120px;
          left: -90px;
          background: rgba(249, 115, 22, 0.2);
          animation-delay: 2s;
        }

        .hero {
          background: linear-gradient(
            140deg,
            rgba(255, 255, 255, 0.95),
            rgba(255, 255, 255, 0.76)
          );
          border: 1px solid rgba(15, 118, 110, 0.14);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.1);
          backdrop-filter: blur(8px);
        }

        .hero-kicker {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0f766e;
        }

        .hero h1 {
          margin: 0.55rem 0 0;
          font-size: clamp(1.6rem, 3.3vw, 2.6rem);
          line-height: 1.1;
          font-weight: 700;
        }

        .hero-subtitle {
          margin: 0.6rem 0 0;
          color: #3e5a65;
          max-width: 50ch;
        }

        .hero-stats {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .stat-chip {
          background: #ffffff;
          border: 1px solid rgba(14, 116, 110, 0.2);
          border-radius: 14px;
          padding: 0.7rem 0.9rem;
          min-width: 150px;
          display: grid;
          gap: 0.2rem;
        }

        .stat-label {
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #5f7280;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .workspace-grid {
          margin-top: 1.35rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .panel {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 22px;
          padding: 1.25rem;
          border: 1px solid rgba(203, 213, 225, 0.9);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.09);
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .panel-heading p {
          margin: 0.4rem 0 1rem;
          color: #526571;
          font-size: 0.93rem;
        }

        .input-group {
          margin-bottom: 0.9rem;
          display: grid;
          gap: 0.42rem;
        }

        .input-group label {
          font-weight: 600;
          font-size: 0.88rem;
          color: #174452;
        }

        .ui-input {
          border: 1px solid #bfdbdf;
          border-radius: 12px;
          padding: 0.7rem 0.8rem;
          font-size: 0.95rem;
          color: #0f172a;
          background: #fbfffe;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .ui-input:focus {
          outline: none;
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
        }

        .form-actions {
          margin-top: 0.6rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .btn-primary-ui,
        .btn-secondary-ui {
          border: 0;
          border-radius: 999px;
          padding: 0.64rem 1.1rem;
          font-weight: 600;
          font-size: 0.9rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-primary-ui {
          color: #ffffff;
          background: linear-gradient(120deg, #0f766e, #0d9488);
          box-shadow: 0 8px 14px rgba(15, 118, 110, 0.24);
        }

        .btn-secondary-ui {
          background: #e8eef0;
          color: #1f2937;
        }

        .btn-primary-ui:hover,
        .btn-secondary-ui:hover {
          transform: translateY(-1px);
        }

        .table-scroll {
          overflow-x: auto;
        }

        .directory-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 640px;
          overflow: hidden;
        }

        .directory-table th {
          background: #dff7f5;
          color: #134250;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.75rem;
          border-bottom: 1px solid #c5e8e4;
        }

        .directory-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1f2937;
          font-size: 0.92rem;
        }

        .directory-table tbody tr:nth-child(even) td {
          background: #fbfdfd;
        }

        .table-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .btn-table {
          border: 0;
          border-radius: 8px;
          padding: 0.35rem 0.65rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-edit {
          background: #fde68a;
          color: #78350f;
        }

        .btn-delete {
          background: #fecaca;
          color: #7f1d1d;
        }

        .empty-state {
          text-align: center;
          padding: 1.25rem;
          color: #526571;
        }

        @media (min-width: 992px) {
          .workspace-grid {
            grid-template-columns: 1.02fr 1.38fr;
            gap: 1.2rem;
          }

          .hero {
            padding: 1.85rem;
          }

          .panel {
            padding: 1.4rem;
          }
        }

        @keyframes drift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(12px);
          }
        }
      `}</style>
    </>
  );
};

export default Page;
