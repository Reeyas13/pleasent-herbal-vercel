import React from 'react'
import Card from './Card';

const Featured = () => {
    const feauredList = [1,2,3,4,5,6,7];
    return (
        <>
        <div className='w-[90%] mx-auto'>
<h3 className='my-4 text-4xl  text-white font-semibold'>Featured Products</h3>
        </div>
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-[90%] mx-auto">
            {feauredList.map(item=><Card />)}
        
        </div>
        </>
        )
}

export default Featured