// import { featuresData } from "../../data/landingData"

// export default function FeaturesSection() {
//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{featuresData.title}</h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">{featuresData.description}</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featuresData.features.map((feature, index) => {
//             const IconComponent = feature.icon
//             return (
//               <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
//                   <IconComponent className="w-6 h-6" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     </section>
//   )
// }


import { featuresData } from "../../data/landingData"

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{featuresData.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{featuresData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
