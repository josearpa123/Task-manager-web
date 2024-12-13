// Funcionalidad de editar tarea con popup

import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const EditTaskPopup = ({ task, onClose }) => {
  const [updatedTask, setUpdatedTask] = useState({ ...task });
  const [errors, setErrors] = useState({});

  const validateTask = () => {
    const newErrors = {};

    if (!updatedTask.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!updatedTask.dueDate.trim()) {
      newErrors.dueDate = "La fecha de entrega es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validateTask()) {
      try {
        await updateDoc(doc(db, "tasks", updatedTask.id), {
          title: updatedTask.title,
          description: updatedTask.description,
          category: updatedTask.category,
          duration: updatedTask.duration,
          dueDate: updatedTask.dueDate,
        });
        onClose();
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Editar Tarea</h3>
        <input
          type="text"
          placeholder="Título"
          value={updatedTask.title}
          onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}

        <textarea
          placeholder="Descripción"
          value={updatedTask.description}
          onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
        ></textarea>

        <select
          value={updatedTask.category}
          onChange={(e) => setUpdatedTask({ ...updatedTask, category: e.target.value })}
        >
          <option value="Personal">Personal</option>
          <option value="Grupo">Grupo</option>
        </select>

        <input
          type="text"
          placeholder="Duración (horas)"
          value={updatedTask.duration}
          onChange={(e) => setUpdatedTask({ ...updatedTask, duration: e.target.value })}
        />

        <input
          type="date"
          value={updatedTask.dueDate}
          onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
        />
        {errors.dueDate && <p style={{ color: "red" }}>{errors.dueDate}</p>}

        <button onClick={handleUpdate}>Guardar Cambios</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditTaskPopup;