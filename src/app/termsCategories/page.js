"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  Shield,
  Mail,
  X,
} from "lucide-react";
import { FaBalanceScale } from "react-icons/fa";
import Link from "next/link";

const TermsPopup = ({ onClose }) => {
  const [expandedSection, setExpandedSection] = useState("general");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const termsCategories = [
    {
      id: "general",
      title: "الشروط العامة",
      icon: <FileText className="w-6 h-6 text-orange-400" />,
      content: [
        {
          title: "القبول بالشروط",
          text: 'باستخدامك لمنصة "بادر" التطوعية، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة في هذه الوثيقة. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.',
        },
        {
          title: "التعديلات على الشروط",
          text: 'تحتفظ منصة "بادر" بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق. سيتم نشر أي تغييرات على هذه الصفحة، ويعتبر استمرارك في استخدام المنصة موافقة منك على التغييرات.',
        },
        {
          title: "الاستخدام المسموح",
          text: "يجب استخدام المنصة للأغراض المشروعة فقط وبما يتوافق مع جميع القوانين واللوائح المعمول بها. يحظر استخدام المنصة لأي نشاط غير قانوني أو ضار.",
        },
      ],
    },
    {
      id: "participation",
      title: "شروط المشاركة التطوعية",
      icon: <CheckCircle className="w-6 h-6 text-orange-400" />,
      content: [
        {
          title: "الأهلية للمشاركة",
          text: "يجب أن يكون المتطوع قد أتم 18 عاماً أو أكثر للمشاركة في المبادرات التطوعية. يمكن للقاصرين المشاركة بموافقة خطية من ولي الأمر أو الوصي القانوني.",
        },
        {
          title: "التزامات المتطوع",
          text: "يلتزم المتطوع بالحضور في المواعيد المحددة، والالتزام بقواعد السلامة، واتباع التعليمات الصادرة من منسقي المبادرة، والحفاظ على سمعة المنصة وأهدافها.",
        },
        {
          title: "إلغاء المشاركة",
          text: "في حال تعذر المشاركة، يجب على المتطوع إبلاغ منسق المبادرة قبل 24 ساعة على الأقل من الموعد المحدد للنشاط التطوعي.",
        },
      ],
    },
    {
      id: "privacy",
      title: "سياسة الخصوصية وحماية البيانات",
      icon: <Shield className="w-6 h-6 text-orange-400" />,
      content: [
        {
          title: "جمع البيانات",
          text: 'تقوم منصة "بادر" بجمع بعض البيانات الشخصية مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف للتواصل معك بشأن الأنشطة التطوعية. نحن نلتزم بحماية خصوصية هذه البيانات وعدم مشاركتها مع أطراف ثالثة دون موافقتك.',
        },
        {
          title: "استخدام البيانات",
          text: "تُستخدم البيانات التي نجمعها لتسهيل مشاركتك في المبادرات التطوعية، وتحسين خدماتنا، وتوفير تجربة مخصصة لك على المنصة.",
        },
        {
          title: "أمان البيانات",
          text: "نتخذ تدابير أمنية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.",
        },
      ],
    },
    {
      id: "liability",
      title: "المسؤولية القانونية",
      icon: <AlertCircle className="w-6 h-6 text-orange-400" />,
      content: [
        {
          title: "حدود المسؤولية",
          text: 'لا تتحمل منصة "بادر" المسؤولية عن أي أضرار مباشرة أو غير مباشرة تنتج عن استخدام المنصة أو المشاركة في الأنشطة التطوعية، ما لم تكن ناتجة عن إهمال جسيم أو سوء سلوك متعمد من قبلنا.',
        },
        {
          title: "التأمين",
          text: "المتطوعون مسؤولون عن توفير تأمينهم الخاص. قد توفر المنصة في بعض الأنشطة المحددة تغطية تأمينية محدودة، وسيتم الإعلان عن ذلك بوضوح قبل النشاط.",
        },
        {
          title: "الإعفاء من المسؤولية",
          text: 'بمشاركتك في الأنشطة التطوعية، فإنك تقر بالمخاطر المحتملة وتوافق على إعفاء منصة "بادر" والجهات المنظمة من المسؤولية عن الإصابات أو الأضرار التي قد تحدث أثناء المشاركة.',
        },
      ],
    },
    {
      id: "intellectual",
      title: "الملكية الفكرية",
      icon: <HelpCircle className="w-6 h-6 text-orange-400" />,
      content: [
        {
          title: "محتوى المنصة",
          text: 'جميع المحتويات المنشورة على منصة "بادر" من نصوص وصور وشعارات وتصاميم هي ملكية خاصة للمنصة أو مرخصة لها، ويُمنع استخدامها دون إذن مسبق.',
        },
        {
          title: "محتوى المستخدم",
          text: 'بنشرك أي محتوى على المنصة (صور، تعليقات، مقترحات)، فإنك تمنح "بادر" ترخيصاً غير حصري لاستخدام هذا المحتوى لأغراض تتعلق بالمنصة والترويج لها.',
        },
        {
          title: "التقارير والصور",
          text: "قد يتم التقاط صور وتسجيلات أثناء الأنشطة التطوعية لاستخدامها في التقارير والمواد الترويجية. بمشاركتك، فإنك توافق على هذا الاستخدام ما لم تبد اعتراضك كتابياً.",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mt-15 max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <header className="bg-gradient-to-r text-white py-12 px-4 ">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block p-3 rounded-full bg-[#fa9e1b] bg-opacity-10 mb-4">
              <FaBalanceScale size={32} className="text-amber-50" />
            </div>

            <h1 className="text-4xl font-bold mb-4 text-[#31124b]">
              شروط الخدمة
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-[#31124b] mt-5 ">
              الشروط والأحكام التي تحكم استخدام منصة "بادر" التطوعية لإصلاح الحي
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-12 px-4" dir="rtl">
          {/* Introduction */}
          <section className="mb-12 bg-white rounded-lg p-8 shadow-md border-r-4 border-orange-400">
            <h2 className="text-2xl font-bold text-[#31124b] mb-4">
              مرحباً بك في منصة "بادر"
            </h2>
            <p className="text-gray-700 leading-relaxed">
              نشكرك على اهتمامك بالانضمام إلى مجتمعنا التطوعي. قبل البدء في
              استخدام منصتنا والمشاركة في المبادرات التطوعية لإصلاح الأحياء،
              يرجى قراءة شروط الخدمة التالية بعناية. تهدف هذه الشروط إلى توضيح
              حقوق والتزامات جميع الأطراف المشاركة في المنصة وضمان تجربة إيجابية
              وآمنة للجميع.
            </p>
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-orange-500 ml-2" />
                <p className="text-orange-700 font-medium">
                  بتسجيلك واستخدامك للمنصة، فإنك تقر بأنك قرأت وفهمت ووافقت على
                  الالتزام بجميع الشروط والأحكام الواردة أدناه.
                </p>
              </div>
            </div>
          </section>

          {/* Terms Accordion */}
          <section className="mb-12">
            <div className="space-y-4">
              {termsCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(category.id)}
                    className={`w-full flex items-center justify-between p-5 text-right ${
                      expandedSection === category.id
                        ? "bg-[#31124b] text-white"
                        : "bg-white text-[#31124b] hover:bg-purple-50"
                    } transition-colors duration-300`}
                  >
                    <div className="flex items-center">
                      {expandedSection === category.id ? (
                        <ChevronUp className="w-5 h-5 ml-3" />
                      ) : (
                        <ChevronDown className="w-5 h-5 ml-3" />
                      )}
                      <span className="text-xl font-medium">
                        {category.title}
                      </span>
                    </div>
                    <div
                      className={`${
                        expandedSection === category.id ? "" : "bg-purple-100"
                      } p-2 rounded-full`}
                    >
                      {category.icon}
                    </div>
                  </button>

                  {expandedSection === category.id && (
                    <div className="p-5 border-t border-gray-200">
                      <div className="space-y-6">
                        {category.content.map((item, index) => (
                          <div key={index}>
                            <h4 className="text-lg font-semibold text-[#31124b] mb-2">
                              {item.title}
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Agreement Section */}
          <section className="bg-gradient-to-r from-[#31124b] to-[#31124b] rounded-xl p-8 shadow-lg text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              أتعهد بالالتزام بالشروط
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              أقر بأنني قرأت وفهمت جميع الشروط والأحكام وأوافق على الالتزام بها
              في جميع تعاملاتي مع منصة "بادر" التطوعية.
            </p>
            <button
              onClick={onClose}
              className="bg-[#fa9e1b] text-[#31124b] hover:bg-[#fa9d1bad] px-6 py-3 rounded-lg transition-colors font-bold text-lg inline-block"
            >
              أوافق على الشروط والأحكام
            </button>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-[#31124b] mb-4">
              هل لديك استفسارات؟
            </h3>
            <p className="text-gray-700 mb-6">
              إذا كان لديك أي أسئلة أو استفسارات حول شروط الخدمة، يرجى التواصل
              معنا عبر القنوات التالية:
            </p>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center ml-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#31124b]">البريد الإلكتروني</p>
                <p className="text-gray-600">terms@bader-initiative.org</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-md mt-6">
              <p className="text-sm text-gray-600">
                تم التحديث الأخير لشروط الخدمة بتاريخ: 1 أبريل 2025
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsPopup;
