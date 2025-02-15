import Banner from '../../components/homepage/Banner';
import Payments from '../../components/homepage/Payments';
import Categories from '../../components/homepage/Categories';
import FeaturedProduct from '../../components/homepage/FeaturedProduct';
import WhyBest from '../../components/homepage/WhyBest';
import Faq from '../../components/homepage/Faq';

const HomePage = () => {
  return (
    <div>
      <Banner />
      <Payments />
      <Categories />
      <FeaturedProduct />
      <WhyBest />
      <Faq/>
    </div>
  );
};

export default HomePage;