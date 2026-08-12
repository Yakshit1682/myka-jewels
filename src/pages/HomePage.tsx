import { ArrowRight, Gem, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { products } from "../data/products";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const featuredProducts = products.slice(0, 4);

  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /*
       * HERO
       */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      heroTimeline
        .from(".home-hero .home-eyebrow", {
          y: 25,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          ".home-hero-content h1",
          {
            y: 70,
            opacity: 0,
            duration: 1,
          },
          "-=0.35",
        )
        .from(
          ".home-hero-description",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.55",
        )
        .from(
          ".hero-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5",
        )
        .from(
          ".hero-floating-card",
          {
            x: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        );

      gsap.from(".home-hero-image > img", {
        scale: 1.12,
        duration: 1.8,
        ease: "power2.out",
      });

      /*
       * HERO PARALLAX
       */

      gsap.to(".home-hero-image > img", {
        yPercent: 8,
        scale: 1.06,
        ease: "none",

        scrollTrigger: {
          trigger: ".home-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /*
       * BRAND INTRO
       */

      gsap.from(".brand-intro-section > *", {
        scrollTrigger: {
          trigger: ".brand-intro-section",
          start: "top 78%",
        },

        y: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      /*
       * COLLECTION HEADER
       */

      gsap.from(".section-header-row > *", {
        scrollTrigger: {
          trigger: ".home-collections",
          start: "top 78%",
        },

        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      /*
       * COLLECTION CARDS
       */

      gsap.from(".collection-card", {
        scrollTrigger: {
          trigger: ".collection-grid",
          start: "top 80%",
        },

        y: 70,
        opacity: 0,
        scale: 0.97,

        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      /*
       * COLLECTION IMAGES - SLOW PARALLAX
       */

      gsap.utils.toArray<HTMLElement>(".collection-card").forEach((card) => {
        const image = card.querySelector("img");

        if (!image) return;

        gsap.fromTo(
          image,
          {
            yPercent: -4,
          },
          {
            yPercent: 4,
            ease: "none",

            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      /*
       * FEATURED HEADING
       */

      gsap.from(".home-featured-products .center-section-heading > *", {
        scrollTrigger: {
          trigger: ".home-featured-products",
          start: "top 78%",
        },

        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      /*
       * FEATURED PRODUCT CARDS
       */

      gsap.from(".home-featured-products .product-card", {
        scrollTrigger: {
          trigger: ".home-featured-products .product-grid",
          start: "top 80%",
        },

        y: 60,
        opacity: 0,

        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".center-button-wrapper", {
        scrollTrigger: {
          trigger: ".center-button-wrapper",
          start: "top 92%",
        },

        y: 25,
        opacity: 0,
        duration: 0.7,
      });

      /*
       * EDITORIAL
       */

      gsap.from(".editorial-image", {
        scrollTrigger: {
          trigger: ".home-editorial",
          start: "top 78%",
        },

        clipPath: "inset(0 100% 0 0)",
        duration: 1.25,
        ease: "power3.inOut",
      });

      gsap.from(".editorial-content > *", {
        scrollTrigger: {
          trigger: ".editorial-content",
          start: "top 75%",
        },

        x: 45,
        opacity: 0,
        duration: 0.9,
        stagger: 0.13,
        ease: "power3.out",
      });

      gsap.to(".editorial-image img", {
        yPercent: 7,
        ease: "none",

        scrollTrigger: {
          trigger: ".home-editorial",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      /*
       * BENEFITS
       */

      gsap.from(".benefit-item", {
        scrollTrigger: {
          trigger: ".home-benefits",
          start: "top 82%",
        },

        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      /*
       * NEWSLETTER
       */

      gsap.from(".newsletter-inner > *", {
        scrollTrigger: {
          trigger: ".home-newsletter",
          start: "top 80%",
        },

        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    {
      scope: pageRef,
    },
  );

  return (
    <>
      <Navbar />

      <main ref={pageRef}>
        {/* HERO */}

        <section className="home-hero">
          <div className="home-hero-content">
            <p className="home-eyebrow">TIMELESS FINE JEWELLERY</p>

            <h1>
              Timeless
              <br />
              Elegance,
              <br />
              Everyday.
            </h1>

            <p className="home-hero-description">
              Fine jewellery crafted to celebrate the moments, memories and
              people that matter most.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="primary-gold-button">
                Shop Now
                <ArrowRight size={15} />
              </Link>

              <a href="#collections" className="text-link-button">
                Explore Collections
              </a>
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=90"
              alt="Luxury gold jewellery"
            />

            <div className="hero-floating-card">
              <span>New Collection</span>

              <strong>The Aurelia Edit</strong>

              <Link to="/products">
                Discover
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* BRAND INTRO */}

        <section className="brand-intro-section">
          <p className="home-eyebrow">THE MYKA PHILOSOPHY</p>

          <h2>
            Jewellery made to become
            <br />
            part of your story.
          </h2>

          <p>
            Thoughtfully designed pieces combining timeless craftsmanship with
            effortless modern elegance. Created to be worn, loved and treasured
            for years.
          </p>
        </section>

        {/* COLLECTIONS */}

        <section className="home-collections" id="collections">
          <div className="section-header-row">
            <div>
              <p className="home-eyebrow">DISCOVER</p>

              <h2>Shop by Collection</h2>
            </div>

            <Link to="/products" className="section-view-all">
              View All Jewellery
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="collection-grid">
            <Link to="/products" className="collection-card large">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"
                alt="Gold rings"
              />

              <div className="collection-overlay">
                <span>01</span>

                <div>
                  <p>TIMELESS ESSENTIALS</p>
                  <h3>Rings</h3>
                </div>

                <ArrowRight size={20} />
              </div>
            </Link>

            <Link to="/products" className="collection-card">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
                alt="Gold necklaces"
              />

              <div className="collection-overlay">
                <span>02</span>

                <div>
                  <p>DELICATE BEAUTY</p>
                  <h3>Necklaces</h3>
                </div>

                <ArrowRight size={20} />
              </div>
            </Link>

            <Link to="/products" className="collection-card">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
                alt="Luxury earrings"
              />

              <div className="collection-overlay">
                <span>03</span>

                <div>
                  <p>EFFORTLESS ELEGANCE</p>
                  <h3>Earrings</h3>
                </div>

                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}

        <section className="home-featured-products">
          <div className="center-section-heading">
            <p className="home-eyebrow">OUR FAVOURITES</p>

            <h2>Signature Pieces</h2>

            <p>
              Discover jewellery designed for elegance today and cherished
              memories tomorrow.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="center-button-wrapper">
            <Link to="/products" className="outline-luxury-button">
              Explore All Jewellery
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* EDITORIAL */}

        <section className="home-editorial">
          <div className="editorial-image">
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
              alt="Luxury jewellery collection"
            />
          </div>

          <div className="editorial-content">
            <p className="home-eyebrow">THE GOLDEN HOUR</p>

            <h2>
              Made for moments
              <br />
              worth remembering.
            </h2>

            <p>
              Inspired by warm light, natural textures and timeless silhouettes,
              our signature collection brings quiet luxury into your everyday
              life.
            </p>

            <Link to="/products" className="editorial-link">
              Discover The Collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* BENEFITS */}

        <section className="home-benefits">
          <div className="benefit-item">
            <Gem size={25} strokeWidth={1.3} />

            <h3>Fine Craftsmanship</h3>

            <p>
              Thoughtfully crafted jewellery with attention to every detail.
            </p>
          </div>

          <div className="benefit-item">
            <Sparkles size={25} strokeWidth={1.3} />

            <h3>Timeless Design</h3>

            <p>Elegant pieces created to transcend seasons and trends.</p>
          </div>

          <div className="benefit-item">
            <ShieldCheck size={25} strokeWidth={1.3} />

            <h3>Authenticity Guaranteed</h3>

            <p>Every piece is carefully inspected and authenticated.</p>
          </div>

          <div className="benefit-item">
            <Truck size={25} strokeWidth={1.3} />

            <h3>Insured Delivery</h3>

            <p>Complimentary secure shipping for your jewellery purchases.</p>
          </div>
        </section>

        {/* NEWSLETTER */}

        <section className="home-newsletter">
          <div className="newsletter-inner">
            <p className="home-eyebrow">THE MYKA JOURNAL</p>

            <h2>Stay in our world.</h2>

            <p>
              Be the first to discover new collections, exclusive stories and
              private events.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
              />

              <button type="submit">
                Subscribe
                <ArrowRight size={15} />
              </button>
            </form>

            <small>
              By subscribing, you agree to receive MYKA updates and offers.
            </small>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
