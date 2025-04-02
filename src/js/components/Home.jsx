import React, { useState, useEffect } from "react";


const Home = () => {
	const apiURL = "https://playground.4geeks.com/todo";
	const userName = "RsCuervo";
	const [todo, setTodo] = useState("");
	const [items, setItems] = useState([]);


	useEffect(() => {
		fetch(`${apiURL}/users/${userName}`)
			.then((response) => response.json())
			.then((data) => {
				console.log("Tareas obtenidas:", data);
				setItems(data.todo || []);
			})
			.catch((err) => {
				console.error("Error al obtener tareas:", err);
			});
	}, []);


	const handleAddTodo = () => {
		if (!todo.trim()) {
			alert("No puedes agregar una tarea vacía.");
			return;
		}

		fetch(`${apiURL}/todos/${userName}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ label: todo, is_done: false }),
		})
			.then((resp) => {
				if (!resp.ok) throw new Error("Error al crear la tarea");
				return resp.json();
			})
			.then((newTask) => {
				console.log("Tarea añadida:", newTask);
				setItems([...items, newTask]);
				setTodo("");
			})
			.catch((err) => console.error("Error al añadir tarea:", err));
	};


	const handleDelete = (id) => {
		fetch(`${apiURL}/todos/${id}`, {
			method: "DELETE",
		})
			.then((resp) => {
				if (!resp.ok) throw new Error("Error al eliminar la tarea");
				setItems(items.filter((item) => item.id !== id)); 
			})
			.catch((err) => console.error("Error al eliminar tarea:", err));

	};


	const eliminarTareas = () => {
		const promises = items.map((item) => {
			
			return fetch(`${apiURL}/todos/${item.id}`, {
				method: "DELETE",
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error al eliminar la tarea con id ${item.id}`);
				}
			});
		});
	
		
		Promise.all(promises)
			.then(() => {
				setItems([]); 
				console.log("Todas las tareas han sido eliminadas.");
			})
			.catch((err) => {
				console.error("Error al eliminar una o más tareas:", err);
			});
	};
	return (
		<div className="text-center">
			<h1 className="text-center mt-5">Todos</h1>
			<div className="container mt-5">

				<input
					type="text"
					value={todo}
					className="form-control mb-3"
					placeholder="What needs to be done?"
					onChange={(e) => setTodo(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
				/>


				<div className="tasks-container">
					{items.length === 0 ? (
						<p className="text-muted">No hay tareas, añade tareas</p>
					) : (
						items.map((item) => (
							<div key={item.id} className="task-item position-relative">
								<input
									type="text"
									className="task-input form-control"
									value={item.label}
									readOnly
								/>
								<button
									className="btn btn-sm btn-outline-danger delete-btn"
									onClick={() => handleDelete(item.id)}
								>
									Eliminar
								</button>
							</div>
						))
					)}
				</div>


				{items.length > 0 && (
					<button className="btn btn-danger mt-4" onClick={eliminarTareas}>
						Borrar Lista
					</button>
				)}
			</div>
		</div>
	);

};


export default Home;