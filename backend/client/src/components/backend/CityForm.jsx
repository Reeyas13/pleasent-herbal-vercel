import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../../axios';

function CityForm({ city, onClose }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: city || { name: '', shippingFees: '' },
    });

    const mutation = useMutation({
        mutationFn: (data) => {
            return city
                ? api.put(`/api/city/${city.id}`, data)
                : api.post('/api/city', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cities']);
            toast.success(city ? 'City updated successfully!' : 'City created successfully!');
            reset();
            onClose();
        },
        onError: (error) => {
            toast.error(`Error: ${error.response?.data?.error || error.message}`);
        },
    }


    );

    const onSubmit = (data) => mutation.mutate(data);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">{city ? 'Edit City' : 'Add City'}</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">City Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full p-2 border rounded"
                            placeholder="Enter city name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Shipping Fees</label>
                        <input
                            {...register('shippingFees', { required: true })}
                            type="number"
                            className="w-full p-2 border rounded"
                            placeholder="Enter shipping fees"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            {city ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CityForm;
