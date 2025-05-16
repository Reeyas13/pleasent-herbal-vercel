import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import api from "../../axios";

export const PopularProducts = ({ categoryId, limit = 4 }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['popularProducts', categoryId],
    queryFn: async () => {
      const url = categoryId 
        ? `/api/popular`
        : `/api/popular`;
      const response = await api.get(url);
      return response.data.popularProducts;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading popular products...</div>;
  if (error) return null;
  if (!data || data.length === 0) return null;

  return (
    <div className="my-8 w-[90%] mx-auto">
        <div className="text-center p-10">

      <h2 className="font-bold text-2xl mb-4 px-4">Popular Products</h2>
        </div>
      <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};