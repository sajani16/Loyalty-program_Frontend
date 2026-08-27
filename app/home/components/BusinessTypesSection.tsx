import {
  Utensils,
  Dumbbell,
  Car,
  Sparkles,
  ShoppingCart,
  Building2,
} from "lucide-react";

export function BusinessTypesSection() {
  const categories = [
    { title: "Restaurants", icon: Utensils },
    { title: "Fitness centres", icon: Dumbbell },
    { title: "Car washes", icon: Car },
    { title: "Beauty parlors", icon: Sparkles },
    { title: "Supermarkets", icon: ShoppingCart },
    { title: "Clinics", icon: Building2 },
  ];

  return (
    <section className="bg-[#F4F6F8] py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Subtitle / Category Label */}
        <p className="text-emerald-600 font-bold text-xs tracking-wider uppercase mb-2">
          For Every Trade
        </p>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Perfect for every kind of business
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-base max-w-xl mb-10 leading-relaxed font-normal">
          Loyalty Bridge works for any shop with repeat customers — cafés, gyms,
          salons, car washes, grocers, and more.
        </p>

        {/* Wrapping Card Row */}
        <div className="flex flex-wrap gap-4">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex min-h-[120px] min-w-[140px] flex-1 basis-[140px] flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Icon Wrapper with subtle tint background */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-emerald-600 stroke-[1.75]" />
                </div>
                <span className="text-slate-800 font-bold text-sm text-center">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
