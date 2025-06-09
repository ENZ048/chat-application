import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Shield, Zap, Globe, Smartphone, Bell, Search } from "lucide-react";
import { Github, Twitter, Linkedin } from "lucide-react";
import './styles.css'

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Real-time messaging with zero lag. Experience instant communication like never before.",
    },
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description:
        "Your conversations are protected with military-grade encryption. Privacy is our priority.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with anyone, anywhere in the world. Break down communication barriers.",
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description:
        "Seamlessly sync across all your devices. Never miss a message, wherever you are.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Intelligent alerts that keep you informed without overwhelming you.",
    },
    {
      icon: Search,
      title: "Powerful Search",
      description:
        "Find any message instantly with our advanced search capabilities.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col justify-center items-center text-white overflow-visible">
      <div className="hero min-h-screen w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col justify-center items-center p-4 overflow-visible">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>

          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-bounce"></div>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Connect & Chat
        </h1>

        <span className="text-3xl md:text-5xl font-bold lg:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight">
          Instantly
        </span>

        <p className="text-xl md:text-2xl text-center text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience seamless communication with our modern chat platform.
          Connect with friends, share moments, and stay in touch like never
          before.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link to="/auth">
            <button className="scale-hover flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-5 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>

          <button className="scale-hover flex justify-center items-center bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600 hover:from-blue-600 hover:to-purple-600 px-5 py-3 text-lg font-semibold rounded-xl shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="text-center mb-4 md:mx-8">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              100K+
            </div>
            <div className="text-muted-foreground text-gray-400">
              Active Users
            </div>
          </div>
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-muted-foreground text-gray-400">Up Time</div>
          </div>
          <div className="text-center mb-4">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-muted-foreground text-gray-400">Support</div>
          </div>
        </div>
      </div>

      <section className="py-24 bg-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {" "}
              Discover the features that make our chat application the perfect
              choice for modern communication needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <div
                  key={index}
                  className="scale-hover group bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2 border border-gray-600"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-16"></footer>
    </div>
  );
}
