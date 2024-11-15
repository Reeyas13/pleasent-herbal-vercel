import React from 'react'
import DashboardLayout from "../../layouts/DashboardLayout";
import CategoryTable from '../../components/backend/CategoryTable'

const CategoryIndex = () => {
  return (
    <DashboardLayout>
      <CategoryTable />
    </DashboardLayout>
  )
}

export default CategoryIndex