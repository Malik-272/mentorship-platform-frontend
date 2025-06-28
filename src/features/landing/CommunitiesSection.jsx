import { communitiesData } from "../../data/landingData"

export default function CommunitiesSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{communitiesData.title}</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">{communitiesData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communitiesData.communities.map((community, index) => {
            const IconComponent = community.icon
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{community.title}</h3>
                <p className="text-blue-100">{community.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
