import { useEffect, useState } from "react";
import api from "../../axios";
import ProductCard from "./ProductCard";

export const PersonalRecommendations = ({ userId, limit = 4 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(`/api/user/${userId}?limit=${limit}`);
        console.log(response)
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Error fetching personal recommendations:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [userId, limit]);

  if (!userId) return null;
  if (isLoading) return <div className="text-center py-10">Loading recommendations...</div>;
  if (error) return null; // Don't show errors to the user
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="my-8 w-[90%] mx-auto">
        <div className="text-center p-10">

      <h2 className="font-bold text-2xl mb-4 px-4">Recommended For You</h2>
        </div>
      <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
