"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface Animal {
  id: string;
  name: string;
  species: string;
  age?: number;
  description?: string;
  image?: string;
  location?: string;
  birthDate?: string;
  naturalHabitat?: string;
}

export default function AnimalManager() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    description: "",
    image: "",
    location: "",
    birthDate: "",
    naturalHabitat: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Animal>>({});

  // Fetch all animals
  const fetchAnimals = async () => {
    try {
      const res = await fetch("/api/animals");
      const data = await res.json();
      setAnimals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // Add animal
  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
      birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
    };

    const res = await fetch("/api/animals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setFormData({
        name: "",
        species: "",
        age: "",
        description: "",
        image: "",
        location: "",
        birthDate: "",
        naturalHabitat: "",
      });
      setShowForm(false);
      fetchAnimals();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  // Delete animal
  const handleDelete = async (animalId: string) => {
    if (!confirm("Are you sure you want to delete this animal?")) return;

    const res = await fetch("/api/animals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: animalId }),
    });

    if (res.ok) fetchAnimals();
    else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  // Start editing
  const handleEdit = (animal: Animal) => {
    setEditingId(animal.id);
    setEditData({ ...animal });
  };

  // Save edited animal
  const handleSaveEdit = async (animalId: string) => {
    const payload = {
      id: animalId,
      ...editData,
      age: editData.age ? Number(editData.age) : undefined,
      birthDate: editData.birthDate ? new Date(editData.birthDate) : undefined,
    };

    const res = await fetch("/api/animals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditingId(null);
      fetchAnimals();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Animals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          <FaPlus /> Add Animal
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form
          onSubmit={handleAddAnimal}
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded mb-6 space-y-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="p-2 rounded border" />
            <input type="text" placeholder="Species" value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} required className="p-2 rounded border" />
            <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="p-2 rounded border" />
            <input type="date" placeholder="Birth Date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="p-2 rounded border" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="p-2 rounded border" />
            <input type="text" placeholder="Natural Habitat" value={formData.naturalHabitat} onChange={(e) => setFormData({ ...formData, naturalHabitat: e.target.value })} className="p-2 rounded border" />
            <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="p-2 rounded border col-span-2" />
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="p-2 rounded border col-span-2" />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
      )}

      {/* Animal List */}
      <ul className="space-y-2">
        {animals.map((animal) => (
          <li key={animal.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {editingId === animal.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="p-1 rounded border" placeholder="Name" />
                <input value={editData.species || ""} onChange={(e) => setEditData({ ...editData, species: e.target.value })} className="p-1 rounded border" placeholder="Species" />
                <input type="number" value={editData.age || ""} onChange={(e) => setEditData({ ...editData, age: Number(e.target.value) })} className="p-1 rounded border" placeholder="Age" />
                <input type="text" value={editData.location || ""} onChange={(e) => setEditData({ ...editData, location: e.target.value })} className="p-1 rounded border" placeholder="Location" />
                <input type="text" value={editData.naturalHabitat || ""} onChange={(e) => setEditData({ ...editData, naturalHabitat: e.target.value })} className="p-1 rounded border" placeholder="Natural Habitat" />
                <input type="date" value={editData.birthDate ? new Date(editData.birthDate).toISOString().split("T")[0] : ""} onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })} className="p-1 rounded border" />
                <input type="text" value={editData.image || ""} onChange={(e) => setEditData({ ...editData, image: e.target.value })} className="p-1 rounded border col-span-2" placeholder="Image URL" />
                <input type="text" value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className="p-1 rounded border col-span-2" placeholder="Description" />
                <div className="flex gap-2 mt-2 col-span-2 justify-end">
                  <button onClick={() => handleSaveEdit(animal.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1">
                    <FaSave /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-1">
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {animal.image && <img src={animal.image} alt={animal.name} className="w-12 h-12 object-cover rounded" />}
                <span>{animal.name} ({animal.species})</span>
              </div>
            )}

            {editingId !== animal.id && (
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(animal)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                <button onClick={() => handleDelete(animal.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
