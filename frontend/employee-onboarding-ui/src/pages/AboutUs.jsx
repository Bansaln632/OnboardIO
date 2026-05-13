import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative px-4 py-20 sm:py-32 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce-soft">
              <span className="text-6xl">🚀</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold mb-6">Welcome to OnboardIO</h1>
            <p className="text-2xl sm:text-3xl opacity-95 font-medium">Your Employee Onboarding Companion</p>
            <p className="text-lg opacity-85 max-w-2xl mx-auto">
              Streamlining the journey from new hire to productive team member
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* About Section */}
        <section className="animate-slide-in-right">
          <div className="card bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">ℹ️</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800">About OnboardIO</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              OnboardIO is a <strong className="text-primary-600">modern employee onboarding platform</strong> designed to streamline the process
              of welcoming new team members. We provide a seamless experience for both employees
              and administrators to manage tasks, trainings, and document uploads with ease and efficiency.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">✨ Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need for a smooth onboarding experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "📋", title: "Task Management", desc: "Stay organized with assigned tasks and track completion progress in real-time.", color: "from-blue-500 to-cyan-500" },
              { icon: "🎓", title: "Training Programs", desc: "Access essential training materials and courses tailored for your onboarding journey.", color: "from-purple-500 to-pink-500" },
              { icon: "📄", title: "Document Management", desc: "Upload and manage required documents with streamlined approval workflows.", color: "from-green-500 to-emerald-500" },
              { icon: "📊", title: "Progress Tracking", desc: "Monitor your onboarding progress with intuitive dashboards and real-time updates.", color: "from-orange-500 to-red-500" },
              { icon: "👥", title: "HR Management", desc: "Admins can efficiently manage multiple employees and their onboarding journeys.", color: "from-indigo-500 to-purple-500" },
              { icon: "✅", title: "Approval System", desc: "Streamlined document approval and rejection workflow for faster processing.", color: "from-pink-500 to-rose-500" }
            ].map((feature, index) => (
              <div
                key={index}
                className="card card-hover bg-white group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">🎯 How It Works</h2>
            <p className="text-xl text-gray-600">Four simple steps to complete onboarding</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Sign Up", desc: "Create your account as an employee or HR administrator.", color: "from-blue-500 to-cyan-500" },
              { num: "2", title: "Dashboard", desc: "Access your personalized dashboard with onboarding information.", color: "from-purple-500 to-pink-500" },
              { num: "3", title: "Complete Activities", desc: "Finish assigned tasks, trainings, and upload required documents.", color: "from-green-500 to-emerald-500" },
              { num: "4", title: "Get Approved", desc: "Receive approval from admin and complete your onboarding journey.", color: "from-orange-500 to-red-500" }
            ].map((step, index) => (
              <div
                key={index}
                className="card bg-white text-center group hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                  <span className="text-4xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="relative overflow-hidden rounded-3xl shadow-strong">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full"></div>
            </div>
            <div className="relative px-8 py-20 text-center text-white">
              {!isLoggedIn ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold">Ready to Get Started?</h2>
                  <p className="text-xl opacity-95 max-w-2xl mx-auto">
                    Join OnboardIO today and streamline your employee onboarding experience.
                  </p>
                  <button
                    onClick={() => navigate("/?tab=signup")}
                    className="btn btn-outline !bg-white !text-primary-600 text-lg px-8 py-4 hover:!bg-white hover:!bg-opacity-90"
                  >
                    <span className="text-xl mr-2">✨</span>
                    Sign Up Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold">Complete Your Activities Now</h2>
                  <p className="text-xl opacity-95 max-w-2xl mx-auto">
                    Welcome! Click below to check your assigned activities and continue your onboarding journey. 😊
                  </p>
                  <button
                    onClick={() => navigate("/activities")}
                    className="btn btn-outline !bg-white !text-primary-600 text-lg px-8 py-4 hover:!bg-white hover:!bg-opacity-90"
                  >
                    <span className="text-xl mr-2">⚡</span>
                    Go to Activities
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="text-center py-12 border-t-2 border-gray-200">
          <p className="text-gray-600 text-lg">
            Made with <span className="text-red-500 text-2xl">❤️</span> for seamless employee onboarding
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;

