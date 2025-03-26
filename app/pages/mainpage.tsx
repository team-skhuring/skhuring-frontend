import React from "react";
import { Button } from "../components/ui/button";
import Header from "../components/common/Header";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { FaGoogle,  FaCogs, FaMobileAlt, FaLaptopCode, FaBug } from "react-icons/fa";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header/>

      <main className="grid md:grid-cols-2 items-center py-20 px-10 md:px-24 gap-10">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl font-bold leading-tight">
            함께 <span className="text-purple-500">고민</span>하고 <br />함께 <span className="text-purple-500">성장</span>하는 공간
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            누군가 채팅방을 열면, 누구나 멘토가 되어 <br />
            실시간으로 고민을 듣고, 서로 도울 수 있는 따뜻한 커뮤니티
          </p>
          <div className="mt-8 flex gap-4">
            <Button className="bg-yellow-400 text-black flex gap-2 px-6 py-3 rounded-xl">
              <FaGoogle size={20} /> 카카오로 시작하기
            </Button>
            <Button variant="outline" className="flex gap-2 px-6 py-3 rounded-xl border-gray-300">
              <FaGoogle size={20} /> Google로 시작하기
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          >
    <img
      src="/skhuringMainpage.webp"
      alt="Main visual"
      className="w-full max-w-2xl object-contain"
    />
  </motion.div>
      </main>

      <section className="bg-gray-50 py-16 px-10 md:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Services we offer</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <Card>
            <CardContent className="text-center p-6">
              <FaMobileAlt size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Mobile App Development</h3>
              <p className="text-gray-600 text-sm">
                A Website is an extension of yourself and we can help you to express it properly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-400">
            <CardContent className="text-center p-6">
              <FaLaptopCode size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Web Design & Development</h3>
              <p className="text-gray-600 text-sm">
                Your website is your number one marketing asset because we live in a digital age.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <FaBug size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Software Testing Service</h3>
              <p className="text-gray-600 text-sm">
                We help you test and ensure your digital products meet quality standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <FaCogs size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Software Development</h3>
              <p className="text-gray-600 text-sm">
                Building robust software solutions tailored for your business goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
