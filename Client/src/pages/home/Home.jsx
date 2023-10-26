import { useContext, useEffect } from "react";
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";
import { SearchContext } from "../../context/SearchContext";

const Home = () => {
  const { date: contextDate } = useContext(SearchContext);
  console.log(contextDate);

  useEffect(() => {
    // Check if it's the initial page load
    if (performance.navigation.type === 1) {
      // This is a page reload, so refresh the page
      window.location.reload();
    }
  }, []);

  return (
    <div className="Home">
      <Navbar />
      <Header />
      <div className="homeContainer">
        <Featured />
        <h1 className="homeTitle">Browse By Property</h1>
        <PropertyList />
        <h1 className="homeTitle">Home guest adore</h1>
        <FeaturedProperties />
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
