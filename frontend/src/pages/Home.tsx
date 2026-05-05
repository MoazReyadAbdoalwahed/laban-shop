import HeroBanner from '../components/eCommerce/Herobanner'
import WhyChooseUs from '../components/eCommerce/Whychooseus'
import LatestCollections from '../components/eCommerce/Latestcollections'
import BestSellers from '../components/eCommerce/BestSellers'
import FormToTable from '../components/eCommerce/FormToTable'
import Newsletter from '../components/eCommerce/Newsletter'

function Home() {
    return (
        <>
            <HeroBanner />
            <WhyChooseUs />
            <LatestCollections />
            <BestSellers />
            <FormToTable />
            <Newsletter />
        </>
    )
}

export default Home