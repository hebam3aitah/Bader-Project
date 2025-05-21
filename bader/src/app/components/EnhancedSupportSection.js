import { useState } from "react";

export default function EnhancedSupportSection() {
  const [hovered, setHovered] = useState(null);

  const cards = [
    {
      id: 1,
      icon: (
        <svg
          className="w-12 h-12 mx-auto mb-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      title: "تطوع بوقتك",
      description:
        "شارك في فعالياتنا ومشاريعنا كمتطوع وساهم بمهاراتك في تطوير الحي",
      cta: "سجل كمتطوع",
      link: "/volunteer",
    },
    {
      id: 2,
      icon: (
        <svg
          className="w-12 h-12 mx-auto mb-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
      title: "انضم للشركاء",
      description:
        "قدم دعمك كجهة أو مؤسسة من خلال توفير الموارد أو المواد اللازمة",
      cta: "كن شريكاً معنا",
      link: "/supportFile",
    },
    {
      id: 3,
      icon: (
        <svg
          className="w-12 h-12 mx-auto mb-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      title: "تبرع للمبادرة",
      description:
        "ساهم في دعم مشاريعنا من خلال التبرع المادي لمساعدتنا في الاستمرار والتوسع",
      cta: "تبرع الآن",
      link: "/DonatePage",
    },
  ];

  return (
    <div className="py-5 mb-20 bg-gradient-to-br from-[#4a1e6e] via-[#31124b] to-purple-900 rounded-3xl shadow-2xl border border-purple-700 border-opacity-30 text-white my-5 mx-20">
      <div className="container mx-auto max-w-5xl">
        <div className="relative mb-12">
          <div className="relative flex justify-center">
            <span
              className="bg-gradient-to-r pt-5 from-[#4a1e6e] via-[#31124b] to-purple-900 px-6 text-4xl font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #f59e0b, #fcd34d, #f59e0b)",
              }}
            >
              كن جزءاً من التغيير
            </span>
          </div>
        </div>

        <p className="text-center text-xl mb-14 max-w-3xl mx-auto font-light leading-relaxed">
          نحتاج إلى دعمكم لنحقق طموحاتنا في إصلاح الحي وخلق بيئة أفضل للجميع.
          يمكنكم المساهمة بالوقت، الخبرة، أو الدعم المادي.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-gradient-to-br from-[#4a1e6e] via-[#31124b] p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg border border-purple-700 border-opacity-30 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="text-center">
                <div
                  className={`transition-transform duration-300 ${
                    hovered === card.id ? "scale-110" : ""
                  }`}
                >
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className="mb-6 text-gray-300 text-lg">{card.description}</p>
                <a
                  href={card.link}
                  className={`inline-block rounded-lg px-5 py-2 font-semibold transition-all duration-300 ${
                    hovered === card.id
                      ? "bg-amber-400 text-purple-900"
                      : "border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-purple-900"
                  }`}
                >
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
