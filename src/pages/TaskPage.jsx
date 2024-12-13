import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditTaskPopup from "./EditTaskPopup";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "Personal",
    duration: "",
    dueDate: "",
  });
  const [editTask, setEditTask] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const { currentUser } = useAuth(); // Obtener el usuario actual
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false); // Nuevo estado para mostrar el formulario

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(fetchedTasks);
    });
    return unsubscribe;
  }, []);
  

  const validateTask = () => {
    const newErrors = {};

    if (!taskData.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!taskData.description.trim()) {
      newErrors.description = "La descripción es obligatoria.";
    }

    if (!taskData.dueDate.trim()) {
      newErrors.dueDate = "La fecha de entrega es obligatoria.";
    }

    if (taskData.duration && isNaN(Number(taskData.duration))) {
      newErrors.duration = "La duración debe ser un número válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTask = async () => {
    if (validateTask()) {
      await addDoc(collection(db, "tasks"), {
        ...taskData,
        completed: false,
        createdBy: currentUser.email, // Agregar el correo del creador
      });
      setTaskData({ title: "", description: "", category: "Personal", duration: "", dueDate: "" });
      setErrors({});
      setShowForm(false); // Ocultar el formulario después de agregar la tarea
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  const openEditPopup = (task) => {
    setEditTask(task);
    setShowEditPopup(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirigir a la página de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <div className="welcome-container">
          <p className="welcome-message">Bienvenido: {currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Cerrar Sesión
        </button>
      </nav>
  
      {/* Contenedor para la lista de tareas */}
      <div className="task-list-container">
      <h1 className="task-list-title">Lista de Tareas</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Ocultar Formulario" : "Agregar Tarea"}
        </button>
  
        {/* Formulario de agregar tarea que solo aparece cuando showForm es true */}
        {showForm && (
          <div className="overlay">
            <div className="popup-form">
              <h2>Agregar Tarea</h2>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />
              {errors.title && <p className="error-message">{errors.title}</p>}
              <textarea
                placeholder="Descripción de la tarea"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              ></textarea>
              {errors.description && <p className="error-message">{errors.description}</p>}
              <select
                value={taskData.category}
                onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
              >
                <option value="Personal">Personal</option>
                <option value="Grupo">Grupo</option>
              </select>
              <input
                type="text"
                placeholder="Duración (horas)"
                value={taskData.duration}
                onChange={(e) => setTaskData({ ...taskData, duration: e.target.value })}
              />
              {errors.duration && <p className="error-message">{errors.duration}</p>}
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              />
              {errors.dueDate && <p className="error-message">{errors.dueDate}</p>}
              <div>
                <button onClick={addTask}>Agregar Tarea</button>
                <button className="close-btn" onClick={() => setShowForm(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
  
        <div className="task-section">
          <h2>Tareas Pendientes</h2>
          <ul>
            {pendingTasks.map((task) => (
              <li key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Categoría: {task.category}</p>
                  <p>Duración: {task.duration} horas</p>
                  <p>Fecha de Entrega: {task.dueDate}</p>
                  <p>Creado por: {task.createdBy}</p>
                  <p>Estado: Pendiente</p>
                </div>
                <div>
                  <button onClick={() => toggleComplete(task.id, task.completed)}>Marcar como Completada</button>
                  <button onClick={() => openEditPopup(task)}>Editar</button>
                  <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="task-section">
          <h2>Tareas Completadas</h2>
          <ul>
            {completedTasks.map((task) => (
              <li key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Categoría: {task.category}</p>
                  <p>Duración: {task.duration} horas</p>
                  <p>Fecha de Entrega: {task.dueDate}</p>
                  <p>Creado por: {task.createdBy}</p>
                  <p>Estado: Completada</p>
                </div>
                <div>
                  <button onClick={() => toggleComplete(task.id, task.completed)}>Marcar como Pendiente</button>
                  <button onClick={() => openEditPopup(task)}>Editar</button>
                  <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
  
      {showEditPopup && (
  <div className="overlay2"> 
    <div className="popup-wrapper">
      <EditTaskPopup
        task={editTask}
        onClose={() => setShowEditPopup(false)}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default TaskPage;
