import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { Link } from 'react-router-dom'
import api from '../../axios';

const Products = () => {
    const { data: products = [], error, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/api/products/get/featured');
            return response.data;
        },
    });

    return (
        <>
            <div className="text-center p-10">
                <h1 className="font-bold text-4xl mb-4">Featured Products</h1>
            </div>

            <div id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

                {Array.isArray(products) && products.map((product) => {
                      const images = JSON.parse(product.imageUrls);
                    return (<Link key={product.id} to={"/products/"+product.slug} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                        {/* <a href="#"> */}
                            <img src={process.env.REACT_APP_API_BASE_URL+ images[0]} 
                                alt="Product" className="h-80 w-72 object-cover rounded-t-xl" />
                            <div className="px-4 py-3 w-72">
                                <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-black cursor-auto my-3">Rs{`   ` + product.price}</p>


                                </div>
                            </div>
                        {/* </a> */}
                    </Link>)
                }
                )}



            </div>
        </>
    )
}

export default Products