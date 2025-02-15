import React from 'react';
import { featuredProducts } from '../../libs/data/FeaturedProduct';
import { reinstate } from '../../libs/data/FeaturedProduct';

const FeaturedProduct = () => {
  return (
    <div>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div className="text-center">
            <p className="text-4xl font-semibold text-[var(--primary-color)]">Featured Accounts – Get Started Instantly!</p>
            <p className="text-sm">Browse our top-selling Facebook Ads accounts, verified and ready to use. Enjoy instant activation, high trust scores, and seamless ad approvals.</p>
          </div>

          {/* facebook accounts   */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">Facebook Accounts</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  featuredProducts?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex ' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>

          {/* reinstate accounts */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">REINSTATE ACCOUNTS (ARI-2LINE)</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  reinstate?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>

          {/* facebook accounts   */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">Facebook Accounts</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  featuredProducts?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>

          {/* reinstate accounts */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">REINSTATE ACCOUNTS (ARI-2LINE)</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  reinstate?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>


          {/* facebook accounts   */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">Facebook Accounts</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  featuredProducts?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>

          {/* reinstate accounts */}
          <div class="my-10 w-full mx-auto overflow-auto">
            <p className="text-center bg-[var(--secondary-color)] text-white py-2 text-2xl font-bold rounded-t-2xl">REINSTATE ACCOUNTS (ARI-2LINE)</p>
            <table class="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Plan</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Stock</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Price</th>
                  <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {
                  reinstate?.map(item =>
                    <tr key={item?.id} className='border-b border-gray-300 hover:bg-[var(--primary-color)] hover:text-white'>
                      <td class="px-4 py-3">
                        <div className="flex gap-4">
                          <img src={item?.icon} className='md:w-12 hidden md:flex' alt="" />
                          <div className="">
                            <p className="">{item?.title}</p>
                            <p className="text-xs">{item?.description}</p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 py-3">{item?.stock}</td>
                      <td class="px-4 py-3 text-lg ">
                        <div className="">
                          <p className="">$ {item?.price}/{item?.quantity}pics</p>
                        </div>
                      </td>
                      <td>
                        <button className='bg-[var(--secondary-color)] text-white p-3 rounded-2xl'>Buy Now</button>
                      </td>
                    </tr>
                  )
                }

              </tbody>
            </table>
          </div>


        </div>
      </section>
    </div>
  );
};

export default FeaturedProduct;