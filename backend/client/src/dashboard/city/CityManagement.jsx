import React from 'react';
import CityTable from '../../components/backend/CityTable';
import DashboardLayout from '../../layouts/DashboardLayout';

function CityManagementPage() {
  return (
    <DashboardLayout>

    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">City Management</h1>
      <CityTable /> {/* CityTable includes CityForm modal within it */}
    </div>
    </DashboardLayout>
  );
}

export default CityManagementPage;
