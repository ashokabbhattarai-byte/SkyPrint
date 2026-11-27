"use client";

import { motion } from "framer-motion";
import { Award, Compass, Layers, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const VALUES = [
  {
    number: "01",
    title: "Quality-Focused Printing",
    description:
      "Consistent color calibration, crisp edge trimming, and dependable stock selection across every print run.",
    icon: Award,
    accent: "#079BD3",
  },
  {
    number: "02",
    title: "Creative Advertising Solutions",
    description:
      "Strategic graphic design and physical signage that turn storefronts, events, and campaigns into memorable brand landmarks.",
    icon: Compass,
    accent: "#39C9E9",
  },
  {
    number: "03",
    title: "Diverse Printing Capabilities",
    description:
      "From visiting cards and packaging boxes to wide-format flex hoardings and 3D illuminated acrylic boards under one roof.",
    icon: Layers,
    accent: "#F7941D",
  },
  {
    number: "04",
    title: "Customer-Focused Service",
    description:
      "Responsive proofing, clear artwork guidance, and reliable delivery schedules tailored for businesses and individuals in Jhapa and beyond.",
    icon: Users,
    accent: "#39C9E9",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="relative border-t border-white/10 bg-[#0B1018] py-20 text-[#E6ECF5] sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          theme="dark"
          eyebrow="The Sky Print Standard"
          title="Quality You Can See. Creativity You Can Trust."
          accentWord="Trust."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#131C2B] p-7 transition-all hover:-translate-y-1 hover:border-[#39C9E9]/45"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-[#0B1018]"
                      style={{ color: val.accent }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {val.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-white">
                    {val.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {val.description}
                  </p>
                </div>

                <div
                  className="mt-6 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: val.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
