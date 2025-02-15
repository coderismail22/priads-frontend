import bannerImg from '@/assets/images/banner.svg'
import { BiAlarmExclamation } from 'react-icons/bi';
import { IoTimerSharp } from 'react-icons/io5';
import { MdSecurity } from 'react-icons/md';
const Banner = () => {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <div className=" text-4xl mb-4 font-medium">
              <p className="font-bold text-6xl text-[var(--primary-color)] mb-4">Power Up Your Advertising with </p>
              <p> Premium Facebook Accounts!</p>
            </div>
            <p className=" leading-relaxed">
              Skip the hassle and start running ads instantly with our verified Facebook Ads accounts and Business Managers. Secure, fast, and trusted by marketers worldwide.
            </p>

            <div className="flex my-8 w-full gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <BiAlarmExclamation />
                </div>
                <p className='text-sm'>Instant delivery</p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <IoTimerSharp />
                </div>
                <p className='text-sm'>24/7 Support</p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <MdSecurity />
                </div>
                <p className='text-sm'>100% Secure</p>
              </div>

            </div>

            <div className="flex justify-center">
              <button className="inline-flex text-white  bg-[var(--primary-color)] border-0 py-2 px-12 focus:outline-none hover:bg-indigo-600 rounded-xl text-lg">
                Explore Accounts
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 hover:animate-pulse">
            <img className="object-cover object-center rounded" alt="hero" src={bannerImg} />
          </div>
        </div>
      </section>


    </div>
  );
};

export default Banner;