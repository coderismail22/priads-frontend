import rocket from '@/assets/images/rocket.json';
import Lottie from 'lottie-react';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import visa from "@/assets/icons/visa.png";
import bank from '@/assets/icons/banktransfer.png'
import iban from '@/assets/icons/iban.png'
import mastercard from '@/assets/icons/mastercard.png'


const Payments = () => {
  return (
    <div>
      <div className="bg-white shadow-sm rounded-xl flex flex-col md:flex-row p-10 md:p-0 items-center md:justify-around justify-center">
        <div className="w-52">
          <Lottie animationData={rocket} loop={true} />
        </div>
        <div className="">
          <p className="text-2xl font-semibold text-center my-2">Contact us to pay using this payment methods</p>
          <div className="flex justify-around my-4">
            <div className="">
              <img src={visa} className='w-12' alt="" />
            </div>

            <div className="">
              <img src={bank} className='w-12' alt="" />
            </div>

            <div className="">
              <img src={iban} className='w-12' alt="" />
            </div>

            <div className="">
              <img src={mastercard} className='w-12' alt="" />
            </div>
          </div>
        </div>
        <div className="">
          <button className="inline-flex text-white  bg-[var(--primary-color)] border-0 py-2 px-12 focus:outline-none hover:bg-indigo-600 rounded-xl text-lg items-center gap-2">
            <HiOutlineRocketLaunch /> Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;