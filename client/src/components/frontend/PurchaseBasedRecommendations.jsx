import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

export const PurchaseBasedRecommendations = ({ userId, limit = 4 }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['purchaseRecommendations', userId],
    queryFn: async () => {
      const response = await api.get(`/api/recommendation/purchase-history/${userId}?limit=${limit}`);
      return response.data.recommendations;
    },
    enabled: !!userId,
  });

  if (!userId) return null;
  if (isLoading) return <div className="text-center py-10">Loading recommendations...</div>;
  if (error) return null;
  if (!data || data.length === 0) return null;

  return (
    <div className="my-8">
      <h2 className="font-bold text-2xl mb-4 px-4">Based on Your Purchase History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
