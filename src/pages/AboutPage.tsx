import { ArrowRight, Gem, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AboutPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(
    () => {
      // HERO - animate immediately on page load
      gsap.from(".about-hero-content > *", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".about-hero-image", {
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power2.out",
      });

      // STORY IMAGE
      gsap.from(".about-story-image", {
        scrollTrigger: {
          trigger: ".about-story",
          start: "top 78%",
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: "power2.out",
      });

      // STORY CONTENT
      gsap.from(".about-story-content > *", {
        scrollTrigger: {
          trigger: ".about-story-content",
          start: "top 80%",
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      // VALUES HEADING
      gsap.from(".about-values .center-section-heading > *", {
        scrollTrigger: {
          trigger: ".about-values",
          start: "top 80%",
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      // VALUE CARDS
      gsap.from(".about-value-card", {
        scrollTrigger: {
          trigger: ".about-values-grid",
          start: "top 82%",
        },
        opacity: 0,
        y: 35,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });

      // CRAFT CONTENT
      gsap.from(".about-craft-content > *", {
        scrollTrigger: {
          trigger: ".about-craft",
          start: "top 78%",
        },
        opacity: 0,
        x: -25,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      // CRAFT IMAGE
      gsap.from(".about-craft-image", {
        scrollTrigger: {
          trigger: ".about-craft",
          start: "top 78%",
        },
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power2.out",
      });

      // CTA
      gsap.from(".about-cta > *", {
        scrollTrigger: {
          trigger: ".about-cta",
          start: "top 82%",
        },
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    {
      scope: pageRef,
    },
  );

  return (
    <>
      {/* <Navbar /> */}

      <main ref={pageRef}>
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="home-eyebrow">OUR STORY</p>

            <h1>
              Jewellery with
              <br />
              meaning.
            </h1>

            <p>
              MYKA was created with a simple belief: jewellery should feel
              personal, timeless and worth keeping for generations.
            </p>
          </div>

          <div className="about-hero-image">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury jewellery"
            />
          </div>
        </section>

        <section className="about-story">
          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90"
              alt="Gold ring"
            />
          </div>

          <div className="about-story-content">
            <p className="home-eyebrow">TIMELESS BY DESIGN</p>

            <h2>Made to be worn. Made to be remembered.</h2>

            <p>
              We design jewellery for everyday elegance rather than passing
              trends. Every piece is created with balanced proportions,
              thoughtful detailing and a refined simplicity that allows it to
              remain beautiful year after year.
            </p>

            <p>
              From delicate everyday pieces to designs created for life's
              biggest celebrations, our collections are made to become part of
              your own story.
            </p>

            <Link to="/products" className="editorial-link">
              Explore Our Jewellery
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="about-values">
          <div className="center-section-heading">
            <p className="home-eyebrow">WHAT WE BELIEVE</p>

            <h2>Our Philosophy</h2>

            <p>
              Beautiful jewellery begins with thoughtful design and meaningful
              craftsmanship.
            </p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <Gem size={28} strokeWidth={1.2} />

              <span>01</span>

              <h3>Craftsmanship</h3>

              <p>
                Every detail matters, from the proportions of a setting to the
                final polish of every surface.
              </p>
            </div>

            <div className="about-value-card">
              <Sparkles size={28} strokeWidth={1.2} />

              <span>02</span>

              <h3>Timelessness</h3>

              <p>
                We create jewellery that transcends seasons and remains relevant
                throughout generations.
              </p>
            </div>

            <div className="about-value-card">
              <Heart size={28} strokeWidth={1.2} />

              <span>03</span>

              <h3>Meaning</h3>

              <p>
                Jewellery carries memories. Our pieces are designed for the
                moments and people you want to remember.
              </p>
            </div>
          </div>
        </section>

        <section className="about-craft">
          <div className="about-craft-content">
            <p className="home-eyebrow">OUR CRAFT</p>

            <h2>
              Beauty lives
              <br />
              in the details.
            </h2>

            <p>
              From the first sketch to the final inspection, every design passes
              through a considered process focused on quality, proportion and
              finish.
            </p>

            <p>
              Our aim is simple: create pieces that feel just as special years
              from now as they did the first time you wore them.
            </p>
          </div>

          <div className="about-craft-image">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90"
              alt="Fine jewellery craftsmanship"
            />
          </div>
        </section>

        <section className="about-cta">
          <p className="home-eyebrow">DISCOVER MYKA</p>

          <h2>Find your timeless piece.</h2>

          <p>
            Discover jewellery designed to celebrate everyday moments and
            unforgettable occasions.
          </p>

          <Link to="/products" className="primary-gold-button">
            Shop Jewellery
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default AboutPage;
