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
  },
  {
    number: "02",
    title: "Creative Advertising Solutions",
    description:
      "Strategic graphic design and physical signage that turn storefronts, events, and campaigns into memorable brand landmarks.",
    icon: Compass,
  },
  {
    number: "03",
    title: "Diverse Printing Capabilities",
    description:
      "From visiting cards and packaging boxes to wide-format flex hoardings and 3D illuminated acrylic boards under one roof.",
    icon: Layers,
  },
  {
    number: "04",
    title: "Customer-Focused Service",
    description:
      "Responsive proofing, clear artwork guidance, and reliable delivery schedules tailored for businesses and individuals in Jhapa and beyond.",
    icon: Users,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="relative border-t border-slate-200 bg-[#F5F7F9] py-20 text-[#202B36] sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
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
                className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-7 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-[#F5F7F9] text-[#078FCB]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-[#153B60]/50">
                      {val.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-[#153B60]">
                    {val.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#202B36]/80">
                    {val.description}
                  </p>
                </div>

                <div className="mt-6 h-0.5 w-10 rounded-full bg-[#F7941D] transition-all duration-300 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
