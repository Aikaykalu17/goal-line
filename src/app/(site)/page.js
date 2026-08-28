import About from "../components/About";
import FeatureList from "../components/FeatureList";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import StepsList from "../components/StepsList";

function Home() {
  return (
    <>
      <Hero />

      <FeatureList />

      <Reveal>
        <StepsList />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
    </>
  );
}

export default Home;
