import About from "../components/About";
import FeatureList from "../components/FeatureList";
import Hero from "../components/Hero";
import StepsList from "../components/StepsList";

function Home() {
  return (
    <>
      <Hero />
      <FeatureList />
      <StepsList />
      <About />
    </>
  );
}

export default Home;
