import React from 'react';

import categories from '../../libs/data/CategoryArray';

const Categories = () => {
  return (
    <div className='mt-36'>
      <div className="text-center">
        <p className="text-4xl font-semibold text-[var(--primary-color)]">Find the Perfect Account for Your Needs!</p>
        <p className="text-sm">Choose from our wide range of verified and reinstated accounts to get started instantly.</p>
      </div>

      <div className="grid my-5 md:grid-cols-4 gap-6">
        {
          categories?.map((item) => (
            <div
              key={item?.id}
              className="bg-white shadow-sm px-5 rounded-sm py-5 hover:bg-[var(--primary-color)]  hover:text-white hover:shadow-lg flex flex-col justify-center items-center">
              <img src={item?.icon} className='w-12' alt="" />
              <p className="text-sm text-center my-2 font-semibold">{item?.name}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Categories;