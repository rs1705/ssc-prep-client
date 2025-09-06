import React from "react";

const About = () => {
  return (
    <section className="px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl lg:text-4xl md:text-4xl font-bold text-black mb-4">
          About Us
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Welcome to{" "}
          <span className="font-semibold text-slate-900">SSC Prep</span> – a
          next-generation exam preparation platform built to help aspirants
          succeed in
          <span className="font-medium">SSC and other competitive exams</span>.
          Our app is designed to make learning engaging through quizzes, mock
          tests, and an upcoming
          <span className="font-semibold">real-time battle feature</span> where
          you can compete with other learners.
        </p>
        <p className="text-md font-semibold text-red-500 italic">
          🚧 Note: The app is still in its development phase. We are constantly
          improving and adding new features to give you the best experience.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="inline-block px-6 py-3 text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-md transition-all duration-300"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
