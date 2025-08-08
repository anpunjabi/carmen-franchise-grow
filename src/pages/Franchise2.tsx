import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layers, Sliders, ShieldCheck } from "lucide-react";

const SEOHead: React.FC = () => {
  useEffect(() => {
    // Title
    document.title = "Franchise Software Platform – Demo Landing";

    // Meta description
    const description =
      "Clean hero, features, and clear CTAs for a fast franchise landing page you can publish quickly.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    // Canonical
    const canonicalHref = `${window.location.origin}/franchise2`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalHref);

    // JSON-LD (WebPage)
    const scriptId = "ldjson-franchise2";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Franchise Software Platform – Demo Landing",
      url: canonicalHref,
      description,
    });
    document.head.appendChild(script);
  }, []);
  return null;
};

const features = [
  {
    icon: Layers,
    title: "Modular by design",
    description: "Stack only the modules you need for each franchise workflow.",
  },
  {
    icon: Sliders,
    title: "Easy to customize",
    description: "Clean copy and layout you can adapt quickly for launch.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & reliable",
    description: "Built with modern best practices and responsive by default.",
  },
];

const Franchise2: React.FC = () => {
  return (
    <>
      <SEOHead />
      <Header />

      <main className="pt-24 md:pt-28">
        {/* Hero */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-carmen-navy">
                  Franchise software that adapts to you
                </h1>
                <p className="mt-4 text-carmen-slate md:text-lg">
                  A clean, conversion‑ready landing page with clear messaging and
                  fast performance so you can go live today.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild className="bg-carmen-gradient text-white hover:opacity-90">
                    <Link to="/demo">Book a demo</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#features">See features</a>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/lovable-uploads/ce0d528b-e6e0-4e11-acd3-5b3a9f26ebf5.png"
                  alt="Franchise software dashboard illustration"
                  className="w-full rounded-xl shadow-lg"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <header className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-carmen-navy">
                Everything you need to launch
              </h2>
              <p className="mt-3 text-carmen-slate">
                Clear sections, concise copy, and a structure built to convert.
              </p>
            </header>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article
                  key={f.title}
                  className="rounded-xl border border-carmen-light-blue/30 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-md bg-carmen-light-blue/20 p-3 text-carmen-blue">
                      <f.icon size={24} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-carmen-navy">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-sm text-carmen-slate">{f.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-carmen-light-blue/20 to-white">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold text-carmen-navy">
              Ready to go live?
            </h3>
            <p className="mt-3 text-carmen-slate">
              Publish your new landing page in minutes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild className="bg-carmen-gradient text-white hover:opacity-90">
                <Link to="/demo">Book a demo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/franchise">Explore modules</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Franchise2;
