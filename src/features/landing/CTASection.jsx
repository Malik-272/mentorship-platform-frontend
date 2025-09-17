// import { Link } from "react-router-dom"
// import { ArrowRight } from "lucide-react"
// import { ctaData } from "../../data/landingData"

// export default function CTASection() {
//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//         <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{ctaData.title}</h2>
//         <p className="text-xl text-gray-600 mb-8">{ctaData.description}</p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <Link
//             to={ctaData.cta.primary.link}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
//           >
//             <span>{ctaData.cta.primary.text}</span>
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//           <Link
//             to={ctaData.cta.secondary.link}
//             className="text-gray-600 hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
//           >
//             {ctaData.cta.secondary.text}
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }

import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { ctaData } from "../../data/landingData"

export default function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {ctaData.title}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {ctaData.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={ctaData.cta.primary.link}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <span>{ctaData.cta.primary.text}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
