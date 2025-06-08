"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
const HeroSection = () => {

    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            }
            else {
                imageElement.classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (
        <div className="pb-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-xl md:text-8xl lg:text-[105px] pb-6 gradient-title">Take Control of Your Money<br />With Smart Intelligence</h1>
                <p className="text-xl text-text mb-8 max-w-2xl mx-auto ">A next-gen finance assistant that helps you monitor, manage, and master your spending — powered by real-time intelligence.</p>
                <div className="flex justify-center space-x-4 mb-3">
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link href="/demo">
                        <Button size="lg" className="px-8" variant="outline">Watch Demo</Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper">
                    <div ref={imageRef} className="hero-image">
                        <Image
                            src="/banner.jpg"
                            width={1280}
                            height={720}
                            alt="Dashboard Preview"
                            priority
                            className=" rounded-lg  shadow-2xl border mx-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;