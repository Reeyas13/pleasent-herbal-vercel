import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
// import api from '../../api'; // Assuming api is your axios instance
import CityForm from './CityForm'; // Assuming you have a CityForm component
import api from '../../axios';

function CityTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null); // To store the city being edited
  const queryClient = useQueryClient();

  // Fetch all cities
  const { data: cities, isLoading, isError } = useQuery({
    queryKey: ['cities'], // Unique key for the query
    queryFn: async () => {
      const response = await api.get('/api/city'); // API endpoint to fetch cities
      return response.data;
    },
  });

  // Mutation for deleting a city
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/city/${id}`); // API endpoint to delete a city
    },
    onSuccess: () => {
      toast.success('City deleted successfully');
      queryClient.invalidateQueries(['cities']); // Invalidate the 'cities' query to refetch data
    },
    onError: (error) => {
      toast.error(`Error deleting city: ${error.message}`);
    },
  });

  // Mutation for adding a city (if needed)
  const createMutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/api/city', data); // API endpoint to add a city
    },
    onSuccess: () => {
      toast.success('City added successfully');
      queryClient.invalidateQueries(['cities']); // Invalidate the query to refresh city list
    },
    onError: (error) => {
      toast.error(`Error adding city: ${error.message}`);
    },
  });

  // Mutation for updating a city
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await api.put(`/api/city/${data.id}`, data); // API endpoint to update a city
    },
    onSuccess: () => {
      toast.success('City updated successfully');
      queryClient.invalidateQueries(['cities']); // Invalidate the query to refresh city list
    },
    onError: (error) => {
      toast.error(`Error updating city: ${error.message}`);
    },
  });

  // Open modal for adding a new city
  const openModal = () => {
    setSelectedCity(null); // Clear selected city for adding
    setIsModalOpen(true);
  };

  // Open modal for editing a city
  const openEditModal = (city) => {
    setSelectedCity(city); // Set the selected city to be edited
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCity(null);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading cities</p>;
  }

  return (
    <div>
      <h1>City Management</h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add City
      </button>

      <table className="min-w-full mt-4 table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Shipping Fees</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td className="border p-2">{city.name}</td>
              <td className="border p-2">{city.shippingFees}</td>
              <td className="border p-2">
                <button
                  onClick={() => openEditModal(city)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(city.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <CityForm
       city={selectedCity}
          onClose={closeModal}
          onSuccess={selectedCity ? updateMutation.mutateAsync : createMutation.mutateAsync} // Check if it's an edit or add
        />
      )}
    </div>
  );
}

export default CityTable;
