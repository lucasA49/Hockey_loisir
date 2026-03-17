import Header from "../Composants/Header"
import HeroBanner from "../Composants/HeroBanner"
import MatchDashboard from "../Composants/MatchDashboard"
import CalendarSection from "../Composants/CalendarSection"
import Footer from "../Composants/Footer"
import "../App.css"
function Home() {
 

  return (
    <>
      <Header />
      <HeroBanner />
      <MatchDashboard />
      <CalendarSection/>
      <Footer/>
    </>
  )
}

export default Home
