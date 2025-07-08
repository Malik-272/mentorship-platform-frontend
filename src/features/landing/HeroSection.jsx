// import { Link } from "react-router-dom"
// import { ArrowRight } from "lucide-react"
// import { heroData } from "../../data/landingData"

// export default function HeroSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20 sm:pt-24 sm:pb-32">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//             {heroData.title.main}{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//               {heroData.title.highlight}
//             </span>
//             <br />
//             {heroData.title.subtitle}
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{heroData.description}</p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link
//               to={heroData.cta.primary.link}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
//             >
//               <span>{heroData.cta.primary.text}</span>
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//             {/* <Link
//               to={heroData.cta.secondary.link}
//               className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
//             >
//               {heroData.cta.secondary.text}
//             </Link> */}
//           </div>
//           <p className="text-sm text-gray-500 mt-4">{heroData.badges.join(" • ")}</p>
//         </div>
//       </div>
//     </section>
//   )
// }

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { heroData } from "../../data/landingData"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-16 pb-20 sm:pt-24 sm:pb-32 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {heroData.title.main}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {heroData.title.highlight}
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">{heroData.title.subtitle}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            {heroData.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={heroData.cta.primary.link}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span>{heroData.cta.primary.text}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            {/* <Link
              to={heroData.cta.secondary.link}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              {heroData.cta.secondary.text}
            </Link> */}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {heroData.badges.join(" • ")}
          </p>
        </div>
      </div>
    </section>
  )
}
